import { Timer } from "./components/Timer";
import { When } from "./components/When";
import {
  Async,
  AsyncFulfilled,
  AsyncPending,
  AsyncRejected,
  EndAsync,
} from "./components/Async";
import { TransitionZone } from "./components/TransitionZone";
import { OnMount } from "./components/OnMount";
import { OnUpdate } from "./components/OnUpdate";
import { Memo } from "./components/Memo";
import { Cond, Otherwise } from "./components/Cond";
import { Run } from "./components/Run";
import { StateGroup, State } from "./components/StateGroup";
import { ViewState } from "./components/ViewState";
import { ProvideSlots, Slot } from "./components/Slot";
import { BindInput } from "./components/BindInput";
import { FadeIn } from "./components/FadeIn";
import { SlideIn } from "./components/SlideIn";
import { AnimatePresence } from "./components/AnimatePresence";
import { Show } from "./components/Show";
import { Loop } from "./components/Loop";
import { BindText } from "./components/BindText";
import { Portal } from "./components/Portal";
import { OnResize } from "./components/OnResize";
import { VirtualList } from "./components/VirtualList";
import { Action } from "./components/Action";
import { PushNotification } from "./components/PushNotification";
import {
  WebSocketProvider,
  OnMessage,
  OnOpen,
  OnClose,
} from "./components/WebSocket";
import { ReadableStream } from "./components/ReadableStream";
import { ServiceWorker } from "./components/ServiceWorker";
import {
  Resource,
  ResourcePending,
  ResourceFulfilled,
  ResourceRejected,
} from "./components/Resource";
import { S } from "./components/S";
import { createSignal, createEffect, createComputed } from "./core/signals";
import {
  useSignalValue,
  useSignal,
  useComputed,
  useSelector,
} from "./hooks/useSignal";

export const Rf = {
  signal: {
    createSignal,
    createEffect,
    createComputed,
    useSignalValue,
    useSignal,
    useComputed,
    useSelector,
  },
  S,
  Timer,
  When,
  TransitionZone,
  OnMount,
  OnUpdate,
  Memo,
  Cond,
  Otherwise,
  Async,
  Pending: AsyncPending,
  Fulfilled: AsyncFulfilled,
  Rejected: AsyncRejected,
  EndAsync,
  Run,
  StateGroup,
  State,
  ViewState,
  ProvideSlots,
  Slot,
  BindInput,
  FadeIn,
  SlideIn,
  AnimatePresence,
  Show,
  Loop,
  BindText,
  Portal,
  OnResize,
  VirtualList,
  Action,
  PushNotification,
  WebSocket: {
    Provider: WebSocketProvider,
    OnMessage,
    OnOpen,
    OnClose,
  },
  ReadableStream,
  ServiceWorker,
  Resource,
  ResourcePending,
  ResourceFulfilled,
  ResourceRejected,
};
