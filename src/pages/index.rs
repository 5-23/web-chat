use leptos::*;
#[component]
pub fn Index() -> impl IntoView {
    // Creates a reactive value to update the button
    let (count, set_count) = create_signal(0);

    view! {
        <h1>"Welcome to Leptos!"</h1>
        <button
            style:color="#000"
            on:click= move |_| set_count.update(|count| *count += 1)
        >"Click Me: " {count}</button>
    }
}