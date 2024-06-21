if (document.getElementById('tierlist')) {
    const Index = ReactDOM.createRoot(document.getElementById("tierlist"));
    Index.render(
        <StrictMode>
            <TierList initialData={data} disabled={disabled} />
        </StrictMode>
    );
}