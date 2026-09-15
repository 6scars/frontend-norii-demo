import AuthForm from './AuthForm.tsx'
import type { AuthFormProps } from './AuthForm.tsx'

type SignUpProps = Omit<AuthFormProps, 'mode'>

export default function SignUp(props: SignUpProps) {
  return <AuthForm {...props} mode="signup" />
}
