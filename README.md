# Hedera Interactive Moderation Agent

An AI-powered content moderation agent that connects to the Hedera network, performs a 0.1 HBAR transaction verification, and then provides real-time content moderation through an interactive chat interface.

## Features

- 🔗 **Hedera Network Integration**: Connected to Hedera testnet for transparency and audit
- 💸 **Transaction Verification**: Performs a 0.1 HBAR transfer before starting moderation
- 🤖 **AI-Powered Moderation**: Uses OpenAI/other LLMs to analyze content
- ⚡ **Real-time Chat**: Interactive CLI for immediate content analysis
- 📊 **Connection Status**: Real-time Hedera network connection indicator
- 🎯 **Binary Response**: Returns only "Flagged" or "Good" as required

## What Gets Flagged

The agent checks for:
- Hate speech, harassment, or discrimination
- Violence or threats
- Explicit sexual content
- Spam or malicious content
- Personal information or doxxing
- Illegal activities
- Misinformation or harmful false information

## Prerequisites

1. **Hedera Testnet Account**: Get one from [Hedera Portal](https://portal.hedera.com/)
2. **AI Provider API Key**: OpenAI, Anthropic, Groq, or Ollama
3. **Node.js**: Version 14 or higher

## Quick Start

### 1. Setup Environment

Create a `.env` file in the project root:

```env
# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your_private_key_here

# AI Provider (choose one)
OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# GROQ_API_KEY=your_groq_api_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Agent

```bash
npm start
# or
npm run moderation
```

## Usage

### Interactive Commands

- **Type any sentence** to moderate it
- **Type `status`** to check Hedera connection
- **Type `test`** to run speed test with sample sentences
- **Type `exit`** to quit

### Example Session

```
🔗 Initializing Hedera Moderation Agent...

🤖 AI model initialized

🔧 Setting up Hedera client...
🔗 Checking Hedera connection...
✅ Connected to Hedera Network
📊 Account: 0.0.123456
💰 Balance: 1000 HBAR

💸 Making test transaction of 0.1 HBAR...
💰 Initial Balance: 1000 HBAR
✅ Transaction successful!
📋 Transaction ID: 0.0.123456@1234567890.123456789
📋 Receipt Status: SUCCESS
💸 Transferred: 0.1 HBAR to 0.0.3
💰 Final Balance: 999.8991 HBAR
📊 Transaction Fee: 0.0009 HBAR
📊 Total Deduction: 0.1009 HBAR (0.1 HBAR + 0.0009 HBAR fee)

🛠️ Initializing Hedera Agent Toolkit...
✅ Hedera Agent Toolkit ready

⚡ Moderation Agent Ready!
📝 Send me sentences to moderate. I will respond with "Flagged" or "Good".
💡 Type "exit" to quit, "status" to check Hedera connection, "test" for speed test

✅ Hedera Moderation > Hello, how are you?
📋 Result: Good (1234ms)

✅ Hedera Moderation > I hate everyone
📋 Result: Flagged (1156ms)

✅ Hedera Moderation > status
✅ Hedera Status: Connected
📊 Account: 0.0.123456
💰 Balance: 999.8991 HBAR

✅ Hedera Moderation > exit
👋 Goodbye!
```

## Transaction Details

The agent performs a **0.1 HBAR transfer** to account `0.0.3` (Hedera test account) before starting moderation:

- **Transfer Amount**: 0.1 HBAR
- **Transaction Fee**: ~0.0009 HBAR
- **Total Deduction**: ~0.1009 HBAR
- **Purpose**: Verify network connectivity and establish audit trail

## Hedera Connection Indicator

The agent shows a visual indicator of its connection status:
- **✅ Hedera Moderation >** (Connected to Hedera network)
- **❌ Hedera Moderation >** (Disconnected from Hedera network)

## AI Providers

The agent supports multiple AI providers:

### OpenAI (Recommended)
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Alternative Providers
```env
# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Groq
GROQ_API_KEY=your_groq_api_key_here

# Ollama (Local)
# No API key needed, but requires Ollama installed
```

## Troubleshooting

### "Missing Hedera configuration"
- Check your `.env` file exists
- Verify `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY` are set
- Ensure you're using Testnet credentials

### "Failed to connect to Hedera"
- Verify your account ID format (e.g., `0.0.123456`)
- Check your private key is correct
- Ensure you have HBAR in your testnet account
- Get testnet HBAR from [Hedera Faucet](https://portal.hedera.com/)

### "No AI provider configured"
- Set at least one API key in `.env`
- For OpenAI: `OPENAI_API_KEY=your_key`
- For Anthropic: `ANTHROPIC_API_KEY=your_key`
- For Groq: `GROQ_API_KEY=your_key`

### "Transaction failed"
- Check you have enough HBAR (need at least 0.1 HBAR)
- Verify you're using Testnet (not Mainnet)
- Check your private key is correct

## Architecture

The agent uses:
- **LangChain**: For agent orchestration and tool management
- **Hedera Agent Kit**: For Hedera network integration
- **OpenAI/Other LLMs**: For content analysis
- **Dynamic Tools**: For modular moderation functionality

## Security Notes

- Never commit your `.env` file to version control
- Use Testnet for development, Mainnet for production
- Keep your private keys secure
- The 0.1 HBAR transfer goes to a test account (no loss of funds)

## License

This project is for demonstration purposes. Ensure compliance with all applicable terms of service when using in production.
