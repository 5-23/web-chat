use leptos::*;
use leptos_router::ActionForm;
use crate::components::*;
#[component]
pub fn Index() -> impl IntoView {
    // Creates a reactive value to update the button
    let (messages, set_messages) = create_signal(vec![("sus", "this is message")]);

    view! {
        <main>
            <form>
                <input type="text" placeholder="sus"/>
                <input type="submit"/>
            </form>

        <For
            each=move || messages.get()
            key=|n| n.clone()
            let:data
        >
            <Message id={data.0} content={data.1}/>
        </For>
        
        </main>
        
        <aside>
            <Channel/>
            <Channel/>
            <Channel/>
            <Channel/>
        </aside>
    }
}