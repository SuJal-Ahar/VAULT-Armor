import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn btn-danger',
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const merged = [variantClass[variant], className].filter(Boolean).join(' ')
  return <button className={merged} {...props} />
}

