# multi-threading

**[Issues and Pull Requests](https://github.com/FishingHacks/futils/labels/multi-threading)**

## Usage

where you want to use the thread:

```typescript
import { startThread } from '@futils/multi-threading';

const thread = startThread<
    'log' | 'eval',
    { log: string; eval: string },
    { log: void; eval: any }
>('./<filename>.js');

export type standardThread = typeof thread;
```

the thread script:

```typescript
import { standardThread } from './<thread-launch-scriptname>';
import { getThreadProcess } from '@fuilts/multi-threading';

const thread = getThreadProcess<standardThread>();
```

## Interface for the thread launcher

- `send(channel, data): Promise<returnedData>`: This will send a message to the thread. The channel is the first type provided to startThread, the data the second and the returnedData the 3rd
- `kill()`: This will kill the thread
- `onMessage(message, (data: returnedData)): () => {}`: This will register a messagelistener for a particular message. message is the first type provided to startThread, returnedData the 3rd. It returns a function, that when called, unregisters the listener
- `onMessageOnce(message, (data: returnedData)): () => {}`: This will register a messagelistener for a particular message. message is the first type provided to startThread, returnedData the 3rd. It returns a function, that when called, unregisters the listener. The listener gets automatically removed after it got triggered once.
- `removeListener(message, cb)`: This will remove a `onMessage` and `onMessageOnce` listener. The cb has to be the same function, not just one that has the same behavior and contents
- `isRunning(): boolean`: Tells you if the thread is still running
- `stop()`: Stops the thread
- `whenExit()`: This will resolve when the thread exits, or immediately if its not running
- `whenReady()`: This will resolve when the thread is ready, or immediately if its running and already ready.


## Interface for the thread client (script)

- `send(message, data)`: This will send a message to the thread launcher. message is the first type provided to startThread, and data the 3rd
- `onMessage(message, (data) => returnedData|Promise<returnedData>)`: This will listen for a message. message is the first type provided to startThread, data the 2nd and returnedData the 3rd. It returns a funtion, that when called, unregisters the listener.
- `onMessageOnce(message, (data) => returnedData|Promise<returnedData>)`: This will listen for a message. message is the first type provided to startThread, data the 2nd and returnedData the 3rd. It returns a funtion, that when called, unregisters the listener. The listener gets automatically removed after it got triggered once.
- `removeListener(message, cb)`: This will remove a `onMessage` and `onMessageOnce` listener. The cb has to be the same function, not just one that has the same behavior and contents