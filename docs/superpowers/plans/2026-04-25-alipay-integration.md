# Alipay Integration and Credit System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete Alipay-based credit recharge system including backend APIs, webhook handling, and frontend pricing/billing UI.

**Architecture:** The system will use Alipay's Page Pay (PC) and Web Pay (Mobile) interfaces. The backend will provide endpoints to create payment orders and handle asynchronous Webhooks from Alipay. The frontend will feature a Pricing page to select credit packages and a Dashboard to view transaction history and current credit balance. Upon successful payment, the user's `credits` in the `users` table will be incremented.

**Tech Stack:** FastAPI, SQLAlchemy, Alipay SDK (python-alipay-sdk), React, Tailwind CSS

---

### Task 1: Alipay SDK Integration and Config

**Files:**
- Modify: `DeepResValue_WebApp/deer-flow/config.yaml`
- Modify: `DeepResValue_WebApp/deer-flow/.env.example`
- Modify: `DeepResValue_WebApp/deer-flow/backend/pyproject.toml`

- [ ] **Step 1: Add Alipay SDK dependency**

Modify `DeepResValue_WebApp/deer-flow/backend/pyproject.toml` to include `python-alipay-sdk`:

```toml
[tool.poetry.dependencies]
# ... existing dependencies ...
python-alipay-sdk = "^3.2.0"
```

- [ ] **Step 2: Add Alipay environment variables**

Modify `DeepResValue_WebApp/deer-flow/.env.example` to add Alipay configurations:

```env
# Alipay Configuration
ALIPAY_APP_ID=
ALIPAY_APP_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=
ALIPAY_SIGN_TYPE=RSA2
ALIPAY_DEBUG=True # Set to False in production
```

- [ ] **Step 3: Update config.yaml**

Modify `DeepResValue_WebApp/deer-flow/config.yaml` to include payment settings:

```yaml
payment:
  provider: alipay
  return_url: "http://localhost:2026/billing/success"
  notify_url: "http://localhost:2026/api/billing/webhook/alipay"
```

- [ ] **Step 4: Commit**

```bash
git add DeepResValue_WebApp/deer-flow/backend/pyproject.toml DeepResValue_WebApp/deer-flow/.env.example DeepResValue_WebApp/deer-flow/config.yaml
git commit -m "chore: add alipay sdk and configuration"
```

### Task 2: Backend Alipay Client Initialization

**Files:**
- Create: `DeepResValue_WebApp/deer-flow/backend/app/billing/alipay_client.py`

- [ ] **Step 1: Create Alipay client wrapper**

Create `DeepResValue_WebApp/deer-flow/backend/app/billing/alipay_client.py`:

```python
import os
from alipay import AliPay
from alipay.utils import AliPayConfig

def get_alipay_client() -> AliPay:
    app_id = os.environ.get("ALIPAY_APP_ID")
    app_private_key = os.environ.get("ALIPAY_APP_PRIVATE_KEY")
    alipay_public_key = os.environ.get("ALIPAY_PUBLIC_KEY")
    debug = os.environ.get("ALIPAY_DEBUG", "True").lower() == "true"

    if not all([app_id, app_private_key, alipay_public_key]):
        raise ValueError("Alipay credentials are not fully configured in environment variables.")

    alipay = AliPay(
        appid=app_id,
        app_notify_url=None,  # Set per request
        app_private_key_string=app_private_key,
        alipay_public_key_string=alipay_public_key,
        sign_type="RSA2",
        debug=debug,
        verbose=debug,
        config=AliPayConfig(timeout=15)
    )
    return alipay
```

- [ ] **Step 2: Commit**

```bash
git add DeepResValue_WebApp/deer-flow/backend/app/billing/alipay_client.py
git commit -m "feat: initialize alipay client"
```

### Task 3: Backend Checkout API

**Files:**
- Modify: `DeepResValue_WebApp/deer-flow/backend/app/billing/router.py`

- [ ] **Step 1: Add create checkout session endpoint**

Modify `DeepResValue_WebApp/deer-flow/backend/app/billing/router.py`:

```python
import uuid
import yaml
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.gateway.deps import get_db_session, get_current_user
from app.auth.models import User
from app.billing.models import Order, Transaction
from app.billing.alipay_client import get_alipay_client
from pydantic import BaseModel

router = APIRouter(prefix="/api/billing", tags=["billing"])

class CheckoutRequest(BaseModel):
    package_id: str # e.g., 'credits_100'
    amount: float # in CNY

@router.post("/checkout/alipay")
async def create_alipay_checkout(
    req: CheckoutRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    try:
        alipay = get_alipay_client()
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    out_trade_no = f"{current_user.id}_{uuid.uuid4().hex[:16]}"
    
    # Read config for URLs
    config_path = Path(__file__).parent.parent.parent.parent.parent / "config.yaml"
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
    
    return_url = config.get("payment", {}).get("return_url", "http://localhost:2026/billing/success")
    notify_url = config.get("payment", {}).get("notify_url", "http://localhost:2026/api/billing/webhook/alipay")

    subject = f"Recharge Credits: {req.package_id}"

    # Generate payment string (for PC Page Pay)
    order_string = alipay.api_alipay_trade_page_pay(
        out_trade_no=out_trade_no,
        total_amount=str(req.amount),
        subject=subject,
        return_url=return_url,
        notify_url=notify_url
    )

    # Save initial order and transaction
    new_order = Order(
        product_id=req.package_id,
        amount=req.amount,
        status="pending"
    )
    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    new_tx = Transaction(
        order_id=new_order.id,
        amount=req.amount,
        currency="cny",
        status="pending",
        stripe_payment_intent_id=out_trade_no # Reusing field for Alipay out_trade_no
    )
    db.add(new_tx)
    await db.commit()

    pay_url = f"https://openapi.alipaydev.com/gateway.do?{order_string}" if os.environ.get("ALIPAY_DEBUG", "True").lower() == "true" else f"https://openapi.alipay.com/gateway.do?{order_string}"
    
    return {"pay_url": pay_url}
```

- [ ] **Step 2: Commit**

```bash
git add DeepResValue_WebApp/deer-flow/backend/app/billing/router.py
git commit -m "feat: add alipay checkout endpoint"
```

### Task 4: Backend Alipay Webhook

**Files:**
- Modify: `DeepResValue_WebApp/deer-flow/backend/app/billing/router.py`

- [ ] **Step 1: Add Webhook handler to verify signature and add credits**

Modify `DeepResValue_WebApp/deer-flow/backend/app/billing/router.py` to add the webhook:

```python
from fastapi import Form
from sqlalchemy.future import select

@router.post("/webhook/alipay")
async def alipay_webhook(request: Request, db: AsyncSession = Depends(get_db_session)):
    data = await request.form()
    data_dict = dict(data)
    
    signature = data_dict.pop("sign", None)
    
    try:
        alipay = get_alipay_client()
    except ValueError:
        return "fail"

    success = alipay.verify(data_dict, signature)
    
    if success and data_dict.get("trade_status") in ("TRADE_SUCCESS", "TRADE_FINISHED"):
        out_trade_no = data_dict.get("out_trade_no")
        user_id_str = out_trade_no.split("_")[0]
        
        try:
            user_id = int(user_id_str)
        except ValueError:
            return "fail"
            
        # Update Transaction and Order
        result = await db.execute(select(Transaction).where(Transaction.stripe_payment_intent_id == out_trade_no))
        tx = result.scalars().first()
        
        if tx and tx.status != "succeeded":
            tx.status = "succeeded"
            
            order_res = await db.execute(select(Order).where(Order.id == tx.order_id))
            order = order_res.scalars().first()
            if order:
                order.status = "completed"
                # Simple logic: extract credits from package_id (e.g., 'credits_100')
                try:
                    credits_to_add = int(order.product_id.split("_")[1])
                except (IndexError, ValueError):
                    credits_to_add = int(order.amount * 10) # Fallback: 1 CNY = 10 Credits
                    
                # Update user credits
                user_res = await db.execute(select(User).where(User.id == user_id))
                user = user_res.scalars().first()
                if user:
                    user.credits += credits_to_add
                    
            await db.commit()
            
        return "success"
    return "fail"
```

- [ ] **Step 2: Commit**

```bash
git add DeepResValue_WebApp/deer-flow/backend/app/billing/router.py
git commit -m "feat: add alipay webhook for credit recharge"
```

### Task 5: Frontend Pricing Page

**Files:**
- Create: `DeepResValue_WebApp/deer-flow/frontend/src/pages/Pricing.tsx`
- Modify: `DeepResValue_WebApp/deer-flow/frontend/src/App.tsx`

- [ ] **Step 1: Create Pricing component**

Create `DeepResValue_WebApp/deer-flow/frontend/src/pages/Pricing.tsx`:

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const packages = [
  { id: 'credits_100', name: '100 Credits', price: 10 },
  { id: 'credits_500', name: '500 Credits', price: 45 },
  { id: 'credits_1000', name: '1000 Credits', price: 80 },
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (pkg: typeof packages[0]) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('/api/billing/checkout/alipay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ package_id: pkg.id, amount: pkg.price })
      });

      if (!res.ok) throw new Error('Checkout failed');
      const data = await res.json();
      
      // Redirect to Alipay
      window.location.href = data.pay_url;
    } catch (error) {
      console.error(error);
      alert('Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Recharge Credits</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="border rounded-lg p-6 shadow-sm flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">{pkg.name}</h2>
            <p className="text-2xl mb-6">¥{pkg.price}</p>
            <button 
              onClick={() => handleCheckout(pkg)}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Buy with Alipay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Register route**

Modify `DeepResValue_WebApp/deer-flow/frontend/src/App.tsx` to include the route:

```tsx
// Add import
import Pricing from './pages/Pricing';

// Add to Routes inside App component
<Route path="/pricing" element={<Pricing />} />
```

- [ ] **Step 3: Commit**

```bash
git add DeepResValue_WebApp/deer-flow/frontend/src/pages/Pricing.tsx DeepResValue_WebApp/deer-flow/frontend/src/App.tsx
git commit -m "feat: add frontend pricing page for alipay checkout"
```

### Task 6: Implement Token Deduction in LangGraph

**Files:**
- Modify: `DeepResValue_WebApp/deer-flow/backend/packages/harness/deerflow/agents/middlewares/token_usage_middleware.py`

- [ ] **Step 1: Deduct credits based on token usage**

Modify `DeepResValue_WebApp/deer-flow/backend/packages/harness/deerflow/agents/middlewares/token_usage_middleware.py` to actually deduct credits. *Note: This assumes we have access to the DB session or can perform a sync/async update.*

```python
# Pseudo-implementation (Requires adapting to the actual middleware context which might not have direct DB access easily, or requires an HTTP call/store update)
import logging
from typing import Any
from langchain_core.messages import AIMessage

logger = logging.getLogger(__name__)

async def token_usage_middleware(state: dict[str, Any]) -> dict[str, Any]:
    # ... existing logic to extract tokens ...
    messages = state.get("messages", [])
    if not messages:
        return state
        
    last_msg = messages[-1]
    if isinstance(last_msg, AIMessage) and hasattr(last_msg, "usage_metadata") and last_msg.usage_metadata:
        total_tokens = last_msg.usage_metadata.get("total_tokens", 0)
        logger.info(f"Tokens used: {total_tokens}")
        
        # NOTE: Real implementation requires fetching the user_id from thread metadata 
        # and updating the User.credits in the database.
        # This might require injecting the DB session into the graph context.
        # For the scope of this plan, we flag this for the implementation phase.
        
    return state
```
*Note: Due to the complexity of injecting DB sessions into LangGraph middlewares, a simpler approach is to deduct credits at the API gateway level (`runs.py`) after the stream finishes, or via a background task.*

- [ ] **Step 2: Commit**

```bash
git add DeepResValue_WebApp/deer-flow/backend/packages/harness/deerflow/agents/middlewares/token_usage_middleware.py
git commit -m "feat: setup token usage deduction hook"
```
