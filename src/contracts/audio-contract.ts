
export type AudioTaskStatus =
  | "queued"
  | "downloading"
  | "decoding"
  | "ready"
  | "playing"
  | "completed"
  | "cancelled"
  | "error";

export interface AudioTask {
  id: string;
  trackUrl: string;
  status: AudioTaskStatus;
  createdAt: number;
  error?: string;
}

export interface AudioQueueState {
  pending: AudioTask[];
  activeTask: AudioTask | null;
  isProcessing: boolean;
}

export interface AudioQueueController {
  enqueue(trackUrl: string): Promise<AudioBuffer>;
  cancel(taskId: string): void;
  cancelAll(): void;
}

export interface AudioEngine {
  initialize(): Promise<void>;
  decode(data: ArrayBuffer): Promise<AudioBuffer>;
  play(buffer: AudioBuffer): void;
  stop(): void;
  cleanup(): void;
}
