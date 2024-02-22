use leptos::*;

#[component]
pub fn Message(id: String, content: String) -> impl IntoView { 
    view! {
        <div class="message">
            <p id="user">{id}</p>:
            <p id="content">{content}</p>
        </div>
    }
}