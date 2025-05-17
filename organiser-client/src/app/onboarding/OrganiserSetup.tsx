export default function OrganiserSetup() {
    return (
        <>
            <h1>Organiser Setup</h1>
            <p>Set up your organiser profile and preferences.</p>
            <form>
                <label>
                    Organiser Name:
                    <input type="text" name="name" />
                </label>
                <button type="submit">Save</button>
            </form>
        </>
    );
}
