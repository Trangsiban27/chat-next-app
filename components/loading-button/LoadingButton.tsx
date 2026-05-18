import React from 'react'
import { Button } from '../ui/button'

interface Props {
    isLoading: boolean,
    children: React.ReactNode,
    className?: string,
    onClick: () => void,
    disabled?: boolean,
    variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined
}

const LoadingButton = ({ variant, isLoading, children, className, disabled, onClick }: Props) => {
    return (
        <Button
            variant={variant ? variant : "outline"}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {isLoading ? 'Loading...' : children}
        </Button>
    )
}

export default LoadingButton