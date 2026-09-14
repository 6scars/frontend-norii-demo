import AuthForm from './AuthForm.tsx'
import type { AuthFormProps } from './AuthForm.tsx'

type SignInProps = Omit<AuthFormProps, 'mode'>

export default function SignIn(props: SignInProps) {
  return <AuthForm {...props} mode="signin" />
}
