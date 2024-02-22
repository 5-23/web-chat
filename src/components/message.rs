use leptos::*;

#[component]
pub fn Message(id: &'static str, content: &'static str) -> impl IntoView { 
    view! {
        <div class="message">
            <p id="user">{id}</p>:
            <p id="content">{content}</p>
        </div>
    }
}