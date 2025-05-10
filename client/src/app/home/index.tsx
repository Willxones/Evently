import { useAuth } from "../../contexts/UserContext";
import { signOut } from "../../features/auth/signOut";

export default function Home() {
	const { user } = useAuth();

	return (
		<>
			<h1>Hello {user?.email || "World!"}</h1>
			{!user ? (
				<a href="/signin">Sign In</a>
			) : (
				<a onClick={signOut}>Sign Out</a>
			)}
		</>
	);
}
