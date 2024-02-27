use crate::components::counter_btn::Button;
use leptos::*;

/// Default Home Page
#[component]
pub fn Home() -> impl IntoView {
    view! {
        <div class="container">

            <h1>"Hello, World :D"</h1>

            <div class="buttons">
                <Button />
                <Button increment=5 />
            </div>

        </div>
    }
}
