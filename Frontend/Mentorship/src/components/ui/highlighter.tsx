import { useEffect, useRef, useState } from "react"
import type React from "react"
import { useInView } from "framer-motion"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const [isReady, setIsReady] = useState(false)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView

  useEffect(() => {
    if (!shouldShow || !isReady) return

    const element = elementRef.current
    if (!element) return

    try {
      // Clean up previous annotation if it exists
      if (annotationRef.current) {
        try {
          annotationRef.current.remove()
        } catch (e) {
          // Silently fail if remove throws
        }
      }

      const annotationConfig = {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      }

      const annotation = annotate(element, annotationConfig)
      annotationRef.current = annotation

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (annotationRef.current) {
          annotationRef.current.show()
        }
      })
    } catch (error) {
      console.error("Highlighter error:", error)
    }

    return () => {
      try {
        if (annotationRef.current) {
          annotationRef.current.remove()
          annotationRef.current = null
        }
      } catch (e) {
        // Silently fail
      }
    }
  }, [shouldShow, isReady, action, color, strokeWidth, animationDuration, iterations, padding, multiline])

  // Set ready state after mount to avoid hydration issues
  useEffect(() => {
    setIsReady(true)
  }, [])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}
