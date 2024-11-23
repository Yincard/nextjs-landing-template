import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../lib/firebase';

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				
				try {
					const userCredential = await signInWithEmailAndPassword(
						auth,
						credentials.email,
						credentials.password
					);
					
					return {
						id: userCredential.user.uid,
						email: userCredential.user.email,
						name: userCredential.user.displayName,
						image: userCredential.user.photoURL,
					};
				} catch (error) {
					console.error('Authentication error:', error);
					return null;
				}
			}
		})
	],
	pages: {
		signIn: '/login',
		signUp: '/signup'
	},
	session: {
		strategy: "jwt"
	},
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user.id = token.sub;
			}
			return session;
		}
	}
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
