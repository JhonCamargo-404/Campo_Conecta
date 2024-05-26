'use client'
import { useState } from 'react'
import { Alert } from 'keep-react'

export const AlertComponent = ({ color, title, description}) => {
    const [showAlert, setShowAlert] = useState(false)
    const onDismiss = () => {
      setShowAlert(!showAlert)
    }
    return (
    <Alert color={color} dismiss={showAlert}>
      <Alert.Container>
        <Alert.Icon />
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Container>
      <Alert.Dismiss onClick={onDismiss}/>
    </Alert>
  )
}
