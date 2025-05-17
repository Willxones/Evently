import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAuthInternal = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [isAuthResolved, setIsAuthResolved] = useState(false);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setIsAuthResolved(true);
		});
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setIsAuthResolved(true);
			}
		);

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	return {
		session,
		user: session?.user as User | null,
		isAuthResolved,
	};
};
