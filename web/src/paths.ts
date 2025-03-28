export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in' },
  dashboard: {
    products: '/dashboard/products',
    chat: '/dashboard/chat',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
