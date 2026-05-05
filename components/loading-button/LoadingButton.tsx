import React from 'react'
import { Button } from '../ui/button'

interface Props {
    isLoading: boolean,
    children: React.ReactNode,
    className?: string,
    onClick: () => void
}

const LoadingButton = ({ isLoading, children, className, onClick }: Props) => {
    return (
        <Button
            variant="outline"
            className={className}
            onClick={onClick}
        >
            {isLoading ? 'Loading...' : children}
        </Button>
    )
}

export default LoadingButton