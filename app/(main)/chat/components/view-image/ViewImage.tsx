import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import React from 'react'

interface Props {
    image: any,
    setIsOpen: (isOpen: boolean) => void
}

const ViewImage = ({ image, setIsOpen }: Props) => {
    return (
        <div className='flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-50'>
            <img src={image?.url} alt="img" className='w-2/3' />

            <Button
                variant={'ghost'}
                className='absolute top-5 right-5 bg-white cursor-pointer'
                onClick={() => setIsOpen(false)}
            >
                <X className='w-22' />
            </Button>
        </div>
    )
}

export default ViewImage