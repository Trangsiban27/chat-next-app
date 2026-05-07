import LoadingButton from '@/components/loading-button/LoadingButton'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { UserService } from '@/services/userService'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

const schema = yup.object().shape({
    showOnlineStatus: yup.boolean(),
})

const Privacy = () => {
    const { control, watch, reset, formState: { isValid, isDirty } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
        }
    })

    const form = watch()

    const { data: privacyData, isLoading } = useQuery({
        queryKey: ['user-privacy'],
        queryFn: UserService.getUserPrivacy
    })

    const { mutate: updatePrivacy, isPending } = useMutation({
        mutationFn: async (data: any) => await UserService.updatePrivacy(data),
        onSuccess: (res) => {
            toast.success('Privacy settings updated successfully')
        },
        onError: (error) => {
            toast.error('Failed to update privacy settings')
        }
    })

    const privacySettings = privacyData?.data?.metadata?.settings

    useEffect(() => {
        if (privacySettings) {
            reset({
                showOnlineStatus: privacySettings?.showOnlineStatus
            })
        }
    }, [privacySettings])

    const handleSubmit = () => {
        updatePrivacy(form)
    }

    return (
        <div className='flex flex-col gap-y-6'>
            <div>
                <h2 className='text-lg font-semibold'>Privacy Settings</h2>
                <p className='text-sm text-gray-600'>Manage your privacy settings here.</p>
            </div>

            <div>
                <Controller
                    name='showOnlineStatus'
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="show-online-status">Show Online Status</Label>
                            <Switch id="show-online-status" checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                    )}
                />
            </div>

            <div>
                <LoadingButton
                    className='cursor-pointer'
                    onClick={handleSubmit}
                    isLoading={false}
                    disabled={!isDirty || !isValid || isPending}
                >
                    Save Changes
                </LoadingButton>
            </div>
        </div>
    )
}

export default Privacy