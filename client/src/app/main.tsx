import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AttendeeLayout from "../components/attendee/AttendeeLayout";
import OrganiserLayout from "../components/organiser/OrganiserLayout";
import Home from "./routes/attendee/Home";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AttendeeLayout />}>
					<Route element={<Home />} index />
				</Route>
				<Route path="/organiser" element={<OrganiserLayout />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
