"use client"

import { useTimelineStore } from "@/store/timeline-store"
import type { FluidInteractionEvent } from "@/types/editor"

let recordingLayerId: string | null = null
let events: FluidInteractionEvent[] = []
let pendingTimelineStart = false

export function startFluidInteractionRecording(layerId: string): void {
  recordingLayerId = layerId
  events = []
  pendingTimelineStart = true
}

export function stopFluidInteractionRecording(): FluidInteractionEvent[] {
  const recordedEvents = events
  recordingLayerId = null
  events = []
  pendingTimelineStart = false
  return recordedEvents
}

export function cancelFluidInteractionRecording(): void {
  recordingLayerId = null
  events = []
  pendingTimelineStart = false
}

export function getFluidInteractionRecordingLayerId(): string | null {
  return recordingLayerId
}

export function getFluidInteractionEventCount(): number {
  return events.length
}

export function recordFluidInteractionEvent(
  layerId: string,
  event: Omit<FluidInteractionEvent, "time">
): void {
  if (recordingLayerId !== layerId) {
    return
  }

  if (pendingTimelineStart) {
    pendingTimelineStart = false
    useTimelineStore.getState().setPlaying(true)
  }

  const time = useTimelineStore.getState().currentTime

  events.push({
    ...event,
    time,
  })
}
