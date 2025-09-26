# Hedera Moderation Agent Setup Guide

## 🔧 Environment Setup

### 1. Create .env File

Create a `.env` file in the project root with the following content:

```env
# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your_private_key_here

# AI Provider (choose one)
OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# GROQ_API_KEY=your_groq_api_key_here
```

### 2. Get Hedera Testnet Account

1. Go to [Hedera Portal](https://portal.hedera.com/)
2. Create a new account or use existing one
3. Switch to **Testnet**
4. Copy your Account ID and Private Key
5. Add them to your `.env` file

### 3. Get AI API Key

Choose one provider:

#### OpenAI (Recommended)
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env` as `OPENAI_API_KEY`

#### Alternative Providers
- **Anthropic**: Get key from [Anthropic Console](https://console.anthropic.com/)
- **Groq**: Get key from [Groq Console](https://console.groq.com/)
- **Ollama**: Install locally from [Ollama](https://ollama.com/)

## 🚀 Running the Agent

### Option 1: Full Hedera Integration (Recommended)
```bash
npm run moderation-hedera
```

This version:
- ✅ Connects to Hedera first
- 💸 Makes a 0.1 HBAR test transaction
- 🤖 Then starts moderation
- 🔗 Shows Hedera connection status

### Option 2: Fast Moderation
```bash
npm run moderation-fast
```

This version:
- ⚡ Faster (direct LLM calls)
- 🔗 Still connected to Hedera
- 📊 Shows response timing

### Option 3: Original Agent
```bash
npm run moderation-interactive
```

This version:
- 🤖 Full agent framework
- 🔗 Hedera integration
- ⏱️ Slower but more features

## 🧪 Testing

### Performance Test
```bash
npm run performance-test
```

### Moderation Test
```bash
npm run test-moderation
```

## 🔍 Troubleshooting

### "Missing Hedera configuration"
- Check your `.env` file exists
- Verify `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY` are set
- Make sure you're using Testnet credentials

### "Failed to connect to Hedera"
- Verify your account ID format (e.g., `0.0.123456`)
- Check your private key is correct
- Ensure you have HBAR in your testnet account
- Try getting testnet HBAR from [Hedera Faucet](https://portal.hedera.com/)

### "No AI provider configured"
- Set at least one API key in `.env`
- For OpenAI: `OPENAI_API_KEY=your_key`
- For Anthropic: `ANTHROPIC_API_KEY=your_key`
- For Groq: `GROQ_API_KEY=your_key`

### "Transaction failed"
- Check you have enough HBAR (need at least 0.1 HBAR)
- Verify you're using Testnet (not Mainnet)
- Check your private key is correct

## 📊 Expected Output

```
🔗 Hedera Transaction Moderation Agent

🤖 AI model initialized

🔧 Setting up Hedera client...
🔗 Checking Hedera connection...
✅ Connected to Hedera Network
📊 Account: 0.0.123456
💰 Balance: 1000 HBAR

💸 Making test transaction of 0.1 HBAR...
✅ Transaction successful!
📋 Transaction ID: 0.0.123456@1234567890.123456789
📋 Receipt Status: SUCCESS

🛠️ Initializing Hedera Agent Toolkit...
✅ Hedera Agent Toolkit ready

⚡ Moderation Agent Ready!
📝 Send me sentences to moderate. I will respond with "Flagged" or "Good".
💡 Type "exit" to quit, "status" to check Hedera connection, "test" for speed test

✅ Hedera Moderation > 
```

## 🎯 Usage Examples

```
✅ Hedera Moderation > Hello, how are you?
📋 Result: Good (1234ms)

✅ Hedera Moderation > I hate everyone
📋 Result: Flagged (1156ms)

✅ Hedera Moderation > status
✅ Hedera Status: Connected
📊 Account: 0.0.123456
💰 Balance: 999.9 HBAR

✅ Hedera Moderation > test
🧪 Running speed test...

"Hello, how are you?" → Good (1234ms)
"I hate everyone" → Flagged (1156ms)
"This is a great day!" → Good (1189ms)
"Send me your credit card" → Flagged (1201ms)

✅ Hedera Moderation > exit
👋 Goodbye!
```

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use Testnet for development, Mainnet for production
- Keep your private keys secure
- The test transaction sends 0.1 HBAR to yourself (no loss)
