# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package that integrates with the Binance cryptocurrency exchange API. It provides two node types for n8n workflows:
- **Binance** - Execution node for trading operations (spot, futures, custom API calls)
- **BinanceTrigger** - WebSocket-based trigger for real-time candlestick monitoring

## Build Commands

```bash
npm run build        # Clean dist/ and compile TypeScript + copy icons
npm run dev          # Development mode with watch and local n8n linking
npm run lint         # Run tslint and eslint
npm run lintfix      # Auto-fix lint issues
npm run format       # Format code with prettier
```

## Architecture

### Dispatcher Pattern

The codebase uses a hierarchical dispatcher pattern for routing operations:

```
Binance.node.ts → binance.execute.ts → {spot,future,custom}.execute.ts → operation.execute.ts
```

1. **Node entry** (`Binance.node.ts`) - Implements `INodeType`, delegates to main dispatcher
2. **Main dispatcher** (`actions/binance.execute.ts`) - Routes by `resource` parameter (spot/future/custom)
3. **Resource executors** (`actions/{resource}/{resource}.execute.ts`) - Routes by `operation` parameter
4. **Operation executors** (`actions/{resource}/{operation}/{operation}.execute.ts`) - Performs actual API calls

### Adding New Operations

Each operation module follows this structure:
```
actions/{resource}/{operation}/
├── {operation}.execute.ts    # API call logic
├── {operation}.properties.ts # UI field definitions (INodeProperties[])
└── index.ts                  # Re-exports execute and properties
```

To add a new operation:
1. Create the operation folder under the appropriate resource
2. Define properties with `displayOptions.show` to control when fields appear
3. Implement execute function that gets credentials, creates `binanceClient`, calls API
4. Register in parent resource's execute switch and properties array
5. Update `IBinanceMap` in `interface.ts` if adding new operation types

### Key Files

- `nodes/Binance/interface.ts` - Type definitions mapping resources to valid operations
- `nodes/Binance/methods/loadOptions.ts` - Dynamic dropdown loaders (symbols, intervals, functions)
- `credentials/BinanceApi.credentials.ts` - API key/secret credential definition

### Trigger System

`BinanceTrigger.node.ts` uses WebSocket connections via `binanceClient.ws.futuresCandles()` to emit workflow triggers based on candlestick events. Triggers support filtering by price change percentage and time throttling.

## Dependencies

- `binance-api-node` - Binance API wrapper (all API calls go through this)
- `n8n-workflow` / `n8n-core` - n8n framework interfaces
