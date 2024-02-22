use leptos::{html::Input, *};
use crate::components::*;
#[component]
pub fn Index() -> impl IntoView {
    let content_ref = NodeRef::<Input>::new();
    // Creates a reactive value to update the button
    // Vec::<(String, String)>::new()
    let (messages, set_messages) = create_signal(vec![
        ("a".to_string(), "a".to_string()),
        ("a".to_string(), "a".to_string()),
        ("b".to_string(), "b".to_string()),
        ("c".to_string(), "c".to_string()),
        ("d".to_string(), "d".to_string()),
    ]);

    view! {
        <main>
            <form on:submit=move |e| {
                e.prevent_default();
                let mut new_value = messages.get().clone();
                new_value.push(("sus".to_string(), content_ref.get().unwrap().value()));
                set_messages.set(new_value);
                logging::log!("{:?} {:?}", messages.get().as_ptr(), messages.get());
            }>
                <input type="text" _ref={content_ref} placeholder="sus"/>
                <input type="submit"/>
            </form>

        <For
            each=move || messages.get()
            key=|n| n.clone()
            let:data
            children=|data|view! { <Message id={data.0} content={data.1}/> }
        />
            
        
        </main>
        
        <aside>
            <Channel/>
            <Channel/>
            <Channel/>
            <Channel/>
        </aside>
    }
}