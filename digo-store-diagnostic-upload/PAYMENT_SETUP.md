# DIGO 测试支付配置

代码默认 `STRIPE_MODE=test`。未配置账户时结账会明确显示不可用。请勿把密钥发进聊天、提交到 GitHub 或放到 NEXT_PUBLIC_ 变量里。

## 在 Vercel 配置

项目：https://vercel.com/diga-s-projects/digo-store-diagnostic/settings/environment-variables

| 变量 | 内容 |
| --- | --- |
| STRIPE_MODE | test |
| STRIPE_SECRET_KEY | 当前 Stripe sandbox 的测试服务端密钥，sk_test_ 或有足够权限的 rk_test_ |
| STRIPE_WEBHOOK_SECRET | 下述测试 webhook 的签名密钥，whsec_ 开头 |
| NEXT_PUBLIC_SITE_URL | https://digo-store-diagnostic.vercel.app |
| NEXT_PUBLIC_SUPABASE_URL | 订单数据库项目 URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | 同一 Supabase 项目的公开 key，供已有商品浏览使用 |
| SUPABASE_SERVICE_ROLE_KEY | 同一 Supabase 项目的服务器 service-role key |

将测试变量配置到需要测试的部署环境，然后重新部署。Production 是网站的部署环境；只要 STRIPE_MODE=test 且密钥为测试密钥，Stripe 仍不扣真钱。不要覆盖已有 live 密钥；如果已有正式环境，先只在 Preview 使用独立的 Stripe sandbox 和测试数据库。

本实现采用 Stripe 托管收银台，不需要客户端 publishable key。付款方式先启用银行卡；其他方式需按账户地区及 Stripe 配置另行验收。实物全款测试先收集美国收货地址；跨境目的地、运费和税费尚未配置。

## Stripe 测试 webhook

在 Stripe 当前 sandbox 的 Workbench → Webhooks 创建 snapshot event destination：

- URL：https://digo-store-diagnostic.vercel.app/api/stripe/webhook
- checkout.session.completed
- checkout.session.async_payment_succeeded
- checkout.session.async_payment_failed

把此 endpoint 的 signing secret 配置到 STRIPE_WEBHOOK_SECRET。测试与正式 endpoint 的签名密钥不能混用。预览部署若有 Vercel 登录保护，Stripe 无法投递；不要把受保护 Preview 当成 webhook 已通过。使用可接收 Stripe 通知的测试部署或 Stripe CLI 转发到本地进行验收。

## Supabase

若还没建立数据库，运行 supabase/schema.sql。已有库不要反复运行整个文件（其中的 policy 不是重复执行脚本）。支付使用已有 orders 表，不需要更改已有数据。至少需有：stripe_session_id 的唯一约束，以及 customer_email、amount_total、currency、status、metadata 字段。只有服务器 service-role 能写订单。

## 验收

1. 从商品页分别测试全款加入购物车与 $4.50 预订定金，检查结账页金额。
2. 在 Stripe 测试收银台使用 4242 4242 4242 4242、任意未来有效期和任意三位 CVC；使用测试邮箱与测试地址。
3. 成功页必须通过 Stripe session 查询确认已付款；在 Supabase orders 查到同一个 stripe_session_id，并核对金额、商品、购买类型和 livemode=false。
4. 重放同一个已付款 webhook，orders 仍只有一条；模拟数据库不可用，webhook 应返回 500，恢复数据库并重试后成功。
5. 用 4000 0000 0000 0002 测试拒付，不应生成 paid 订单；取消 Checkout 后购物车应保留。
6. 直接访问 /checkout/success 不应声称已付款。

自动化检查：`npm test`、`npm run typecheck`、`npm run build`。自动化测试使用 Stripe SDK 签名验证及存储/API替身，不代表 Stripe sandbox 中已经完成实际付款。

## 尚未开通的正式经营功能

- 不会自动执行采购、尾款扣款或退款。Stripe 后台的退款也尚未同步到订单状态；处理退款后需另行核对订单。
- 真实预订付款被服务端禁止，需先落实采购和退款条款，再实现和验收相应流程。
- 实际库存、运费、税费、生产/发货时效与正式收款资格需在正式上线前配置。当前工作不改变 STRIPE_MODE 为 live。

官方参考：https://docs.stripe.com/keys · https://docs.stripe.com/webhooks · https://docs.stripe.com/testing
