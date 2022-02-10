type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export class EventEmitter<T extends EventMap> {
  private events: {
    [K in keyof EventMap]: Array<(p: EventMap[K]) => void>;
  };

  constructor() {
    this.events = {};
  }

  emit<K extends EventKey<T>>(event: K, ...args: T[K][]) {
    if (!(event in this.events)) {
      return;
    }
    this.events[event].forEach(
      // @ts-ignore
      (listener) => listener.apply(null, args)
    );
  }

  off<K extends EventKey<T>>(event: K, listener: EventReceiver<T[K]>) {
    if (!(event in this.events)) {
      return;
    }
    const idx = this.events[event].indexOf(listener);
    if (idx > -1) {
      this.events[event].splice(idx, 1);
    }
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  on<K extends EventKey<T>>(event: K, listener: EventReceiver<T[K]>): () => void {
    if (!(event in this.events)) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  once<K extends EventKey<T>>(event: K, listener: EventReceiver<T[K]>): () => void {
    const remove = this.on(event, (...args) => {
      remove();
      listener(...args);
    });
    return remove;
  }
}

export default EventEmitter;
