"use client";

import { Card, CardContent } from "./card";


export default function SmallCard({children, classes}: Readonly<{children: React.ReactNode, classes: string}>) {

  return (
    <Card size="sm" className={classes}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )

}

export function MediumCard({children, color}: Readonly<{children: React.ReactNode, color: string}>) {
  return (
    <Card size="default" className={color}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export function GradientCard({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className="rounded-3xl bg-linear-to-br from-emerald-400/30 via-emerald-500/10 to-transparent p-px">
      <div className="rounded-3xl bg-neutral-900 p-6">
        {children}
      </div>
    </div>
  )
}