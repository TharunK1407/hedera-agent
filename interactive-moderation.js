const dotenv = require('dotenv');
dotenv.config();

const readline = require('readline');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { AgentExecutor, createToolCallingAgent } = require('langchain/agents');
const { Client, PrivateKey, AccountInfoQuery, Hbar, TransferTransaction } = require('@hashgraph/sdk');
const { HederaLangchainToolkit, coreQueriesPlugin } = require('hedera-agent-kit');
const { DynamicTool } = require('@langchain/core/tools');

// Choose your AI provider
function createLLM() {
  if (process.env.OPENAI_API_KEY) {
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({ model: 'gpt-4o-mini' });
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    const { ChatAnthropic } = require('@langchain/anthropic');
    return new ChatAnthropic({ model: 'claude-3-haiku-20240307' });
  }
  
  if (process.env.GROQ_API_KEY) {
    const { ChatGroq } = require('@langchain/groq');
    return new ChatGroq({ model: 'llama3-8b-8192' });
  }
  
  try {
    const { ChatOllama } = require('@langchain/ollama');
    return new ChatOllama({ 
      model: 'llama3.2',
      baseUrl: 'http://localhost:11434'
    });
  } catch (e) {
    console.error('No AI provider configured. Please set an API key in .env');
    process.exit(1);
  }
}

// Create moderation tool
function createModerationTool(llm) {
  return new DynamicTool({
    name: 'content_moderation',
    description: 'Analyzes text content to determine if it should be flagged or is good. Returns either "Flagged" or "Good".',
    func: async (input) => {
      try {
        const moderationPrompt = ChatPromptTemplate.fromMessages([
          ['system', `You are a content moderation AI. Analyze text for:
          
          - Hate speech, harassment, or discrimination
          - Violence or threats
          - Explicit sexual content
          - Spam or malicious content
          - Personal information or doxxing
          - Illegal activities
          - Misinformation or harmful false information
          
          Respond with ONLY "Flagged" or "Good".`],
          ['human', 'Analyze: {text}']
        ]);

        const chain = moderationPrompt.pipe(llm);
        const response = await chain.invoke({ text: input });
        
        const result = response.content.toString().trim();
        
        if (result.toLowerCase().includes('flagged') || result.toLowerCase().includes('flag')) {
          return 'Flagged';
        } else if (result.toLowerCase().includes('good') || result.toLowerCase().includes('appropriate') || result.toLowerCase().includes('safe')) {
          return 'Good';
        } else {
          return 'Good';
        }
      } catch (error) {
        console.error('Error in moderation tool:', error);
        return 'Good';
      }
    }
  });
}

// Check Hedera connection
async function checkHederaConnection(client) {
  try {
    const accountInfo = await new AccountInfoQuery()
      .setAccountId(process.env.HEDERA_ACCOUNT_ID)
      .execute(client);
    return {
      connected: true,
      accountId: process.env.HEDERA_ACCOUNT_ID,
      balance: accountInfo.balance.toString()
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

// Make a small transaction to verify network connectivity
async function makeTestTransaction(client) {
  try {
    // Get initial balance
    const initialAccountInfo = await new AccountInfoQuery()
      .setAccountId(process.env.HEDERA_ACCOUNT_ID)
      .execute(client);
    const initialBalance = initialAccountInfo.balance.toString();
    
    console.log('💸 Making test transaction of 0.1 HBAR...');
    console.log(`💰 Initial Balance: ${initialBalance} HBAR`);
    
    // Create a transfer transaction to a test account (0.1 HBAR)
    // Using a well-known test account for demonstration
    const testAccountId = "0.0.3"; // Hedera test account
    
    const transferTransaction = new TransferTransaction()
      .addHbarTransfer(process.env.HEDERA_ACCOUNT_ID, new Hbar(-0.1)) // Send 0.1 HBAR from our account
      .addHbarTransfer(testAccountId, new Hbar(0.1))  // Send 0.1 HBAR to test account
      .setTransactionMemo("Moderation Agent Test Transaction - 0.1 HBAR Transfer");

    // Execute the transaction
    const txResponse = await transferTransaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    // Get final balance after transaction
    const finalAccountInfo = await new AccountInfoQuery()
      .setAccountId(process.env.HEDERA_ACCOUNT_ID)
      .execute(client);
    const finalBalance = finalAccountInfo.balance.toString();
    
    const totalDeduction = parseFloat(initialBalance) - parseFloat(finalBalance);
    const transactionFee = totalDeduction - 0.1; // 0.1 HBAR was transferred, rest is fee
    
    console.log(`✅ Transaction successful!`);
    console.log(`📋 Transaction ID: ${txResponse.transactionId.toString()}`);
    console.log(`📋 Receipt Status: ${receipt.status.toString()}`);
    console.log(`💸 Transferred: 0.1 HBAR to ${testAccountId}`);
    console.log(`💰 Final Balance: ${finalBalance} HBAR`);
    console.log(`📊 Transaction Fee: ${transactionFee.toFixed(4)} HBAR`);
    console.log(`📊 Total Deduction: ${totalDeduction.toFixed(4)} HBAR (0.1 HBAR + ${transactionFee.toFixed(4)} HBAR fee)`);
    
    return {
      success: true,
      transactionId: txResponse.transactionId.toString(),
      receipt: receipt,
      initialBalance: initialBalance,
      finalBalance: finalBalance
    };
  } catch (error) {
    console.error('❌ Transaction failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.clear();
  console.log('🔗 Initializing Hedera Moderation Agent...\n');

  // Initialize AI model
  const llm = createLLM();

  // Hedera client setup
  const client = Client.forTestnet().setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY),
  );

  // Check Hedera connection
  const hederaStatus = await checkHederaConnection(client);
  let hederaIndicator = '❌';
  if (hederaStatus.connected) {
    hederaIndicator = '✅';
    console.log(`✅ Connected to Hedera Network`);
    console.log(`📊 Account: ${hederaStatus.accountId}`);
    console.log(`💰 Balance: ${hederaStatus.balance} HBAR\n`);
    
    // Make test transaction
    const transactionResult = await makeTestTransaction(client);
    if (transactionResult.success) {
      console.log('');
    } else {
      console.log('⚠️ Transaction failed, but continuing with moderation...\n');
    }
  } else {
    console.log(`❌ Failed to connect to Hedera: ${hederaStatus.error}\n`);
  }

  const hederaAgentToolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      plugins: [coreQueriesPlugin]
    },
  });
  
  // Create moderation tool
  const moderationTool = createModerationTool(llm);
  
  // Create prompt for moderation
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `You are a content moderation agent connected to the Hedera network. 
    
    Your job is to moderate user content using the content_moderation tool.
    
    IMPORTANT RULES:
    1. You MUST use the content_moderation tool to analyze any text input
    2. You MUST respond with ONLY "Flagged" or "Good" - no other text
    3. You are connected to Hedera network for transparency and audit purposes
    4. Always use the tool first, then respond with the exact result
    
    The user will send you sentences to moderate. Use the tool and respond with only the result.`],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  // Get tools
  const hederaTools = hederaAgentToolkit.getTools();
  const tools = [...hederaTools, moderationTool];

  // Create agent
  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  });
  
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false, // Disable verbose for cleaner output
  });
  
  console.log('🤖 Moderation Agent Ready!');
  console.log('📝 Send me sentences to moderate. I will respond with "Flagged" or "Good".');
  console.log('💡 Type "exit" to quit, "status" to check Hedera connection\n');
  
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question(`${hederaIndicator} Hedera Moderation Agent > `, async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }
      
      if (input.toLowerCase() === 'status') {
        const status = await checkHederaConnection(client);
        if (status.connected) {
          console.log(`✅ Hedera Status: Connected`);
          console.log(`📊 Account: ${status.accountId}`);
          console.log(`💰 Balance: ${status.balance} HBAR\n`);
          hederaIndicator = '✅';
        } else {
          console.log(`❌ Hedera Status: Disconnected - ${status.error}\n`);
          hederaIndicator = '❌';
        }
        askQuestion();
        return;
      }
      
      if (input.trim() === '') {
        askQuestion();
        return;
      }
      
      try {
        console.log('🔍 Analyzing...');
        const response = await agentExecutor.invoke({ input: input.trim() });
        console.log(`📋 Result: ${response.output}\n`);
      } catch (error) {
        console.error(`❌ Error: ${error.message}\n`);
      }
      
      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
