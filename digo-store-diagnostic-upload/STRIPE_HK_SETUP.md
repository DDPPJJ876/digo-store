# Digo 香港公司 Stripe 接入交接

核对日期：2026-10-10。以下是开户准备和开发交接，不代表账户已审核通过。官网会更新，具体开通资格以该香港账户 Dashboard 为准。

## 商户准备

1. 以真实香港公司的法律主体注册 Stripe 香港商业账户；不要为获得支付方式而填写其他地区或个人主体。
2. 准备公司中英文法定名称、商业登记号码 BRN、注册地址和实际经营地址、业务电话、公司注册证明（CI）、有效商业登记证（BR）等。具体需要上传哪份文件，以 Stripe 审核提示为准。
3. 准备开户授权代表的姓名、出生日期、地址、政府签发身份证明；按要求提供董事、实际受益人或控制人的资料。公司代表没有 HKID 时，Stripe 官方说明可接受其他政府签发身份证明，仍需按流程审核。
4. 准备以公司名称开户的结算银行账户及账户所有权证明；填写银行、银行代码/分行代码、账户号码、账户名及支持的结算币种，以表单字段为准。是否支持具体银行/账户类型需确认。
5. 网站补齐公司主体、客服邮箱/电话、真实商品与币种、预订及退款规则、交付期限、运费税费和隐私政策。预订业务须如实说明定金、等待时间和尾款安排。

证件、银行完整资料在 Stripe Dashboard 内提交；服务端密钥在 Vercel 的私密环境变量内配置。不要贴到聊天、源码仓库或浏览器公开变量。

## 支付方式与币种

| 客户使用方式 | 香港 Stripe 的情况 | Digo 接入动作 |
| --- | --- | --- |
| 美国/欧洲银行发行的 Visa、Mastercard 信用卡或借记卡 | 香港账户可接受，支持全球客户；银行仍可能拒绝个别交易 | 先开 Cards，完成 Checkout / 3DS 测试 |
| 中国大陆个人支付宝 | 香港在支持地区内；不是支付宝商家版，也不是 AlipayHK | Dashboard 启用 Alipay；检查可用订单币种和结算账户 |
| 微信支付 | 香港在支持地区内；原生香港币种映射为 HKD，CNY 适用于所有支持地区 | 启用 WeChat Pay；验收 HKD/CNY presentment 或 Adaptive Pricing 提供的本地币种流程，不能假定直接美元订单能显示 |
| 欧洲银行账户 SEPA Direct Debit | 香港在支持地区内；需要 EUR 订单和授权，可能额外验证，付款确认有延迟 | 第二阶段开启 EUR 定价或经验证的 Adaptive Pricing；仅异步成功后履约 |
| 美国银行账户 ACH Direct Debit | 当前官方商户地区名单不包含香港；与银行发行的 Visa 卡不同 | 不向客户承诺香港账户直接支持 ACH；可先接受美国银行卡，需要 ACH 时向 Stripe 确认合资格方案 |

当前 Digo 基础商品和服务端校验使用 USD。不会用随意固定汇率将美元改成港币。

可先在 Stripe sandbox 启用 Dynamic payment methods + Adaptive Pricing（若账户可用）。官方文档列出 Adaptive Pricing 可解锁 Alipay、WeChat Pay、SEPA 等本地币种方式；逐个模拟 CN/HK/US/欧洲客户，查看最终金额、汇率/费用和实际显示的支付方式。如果不使用该方案，开发者需增加明确的 HKD/EUR 商品价格及订单币种逻辑。

“能收到美国/欧洲客户的钱”和“能直接从当地银行账户扣款”是两件事。不需要逐家接入客户银行来收 Visa/Mastercard。

## 配置顺序

1. 创建并审核香港 Stripe 账户、公司结算银行账户。
2. 建立 sandbox；在 Payment methods 开通可用支付方式，在 Adaptive Pricing 设置中检查本地币种功能。
3. 按 PAYMENT_SETUP.md 配置服务器测试密钥、webhook 签名密钥及 Supabase 订单数据库，重新部署测试环境。当前托管 Checkout 不需要前端 publishable key。
4. 验收 A/B 定金、拒付、返回取消、异步成功、webhook 重放、数据库失败和恢复；使用真实 Stripe sandbox 测试，不仅跑本地 mock 测试。
5. 开发库存确认、尾款订单、退款和发货逻辑。尾款=确认的商品金额−已支付定金+明确列出的运费和税费；避免重复收定金。已到货也走同样的订单核验，可直接开放尾款。
6. 确认最终 A/B 条款和交付承诺、完成端到端验收后，再经过独立上线变更开放 live。当前代码明确阻止 live 收款。

## 预订业务需要注意的时间窗口

支付宝通过 Stripe 原路退款窗口为原支付后 90 天；微信为 180 天。二者退款均为异步。可退预订不能无限期等待后才考虑退款；应设置商户可兑现的采购/交付截止日、退款触发时间和异常退款渠道。不能把“B 不可退”理解成 Digo 无法履约也可以不退，最终条款须匹配面向市场的消费者权利。

当前没有代用户创建 Stripe 账户、提交开户文件、输入密钥、启用 live 或进行真钱交易。

## 官方资料

- 香港企业代表身份：https://support.stripe.com/questions/requirements-for-hong-kong-based-businesses?locale=en-GB
- 账户核验：https://support.stripe.com/questions/what-do-i-need-to-do-to-verify-my-stripe-account/
- 结算账户名要求：https://support.stripe.com/questions/verify-your-bank-account-ownership
- 卡支付：https://docs.stripe.com/payments/cards
- 支付宝：https://docs.stripe.com/payments/alipay
- 支付宝版本：https://support.stripe.com/questions/business-and-international-versions-of-alipay
- 微信支付：https://docs.stripe.com/payments/wechat-pay
- SEPA：https://docs.stripe.com/payments/sepa-debit
- ACH：https://docs.stripe.com/payments/ach-direct-debit
- Adaptive Pricing：https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing?payment-ui=stripe-hosted
