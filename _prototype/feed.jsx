/* ============================================================
   CampusPulse — Community feed
   ============================================================ */

function FeedScreen({ store, onCompose }) {
  const [sort, setSort] = React.useState("trending");
  const items = React.useMemo(() => {
    const arr = [...FEED];
    if (sort === "trending") arr.sort((a, b) => ((b.trending ? 1 : 0) - (a.trending ? 1 : 0)) || (store.starCount(b) - store.starCount(a)));
    return arr;
  }, [sort, store.state]);
  const trending = FEED.filter((f) => f.trending);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "8px 4px 48px" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 700 }}>Community</h1>
        <p style={{ margin: 0, fontSize: 15, color: "var(--text-2)" }}>
          Student-to-student — runs, jams, resells, study groups. The unofficial pulse of campus.
        </p>
      </div>

      {/* compose */}
      <button onClick={onCompose} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center",
        gap: 12, padding: "14px 16px", marginBottom: 18, borderRadius: "var(--r-lg)", cursor: "pointer",
        background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
        <Avatar person={avatar("You Student")} size={36} />
        <span style={{ flex: 1, fontSize: 14.5, color: "var(--text-3)" }}>Share something with campus…</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700,
          color: "var(--cat-tech)" }}><Icon name="plus" size={15} /> Post</span>
      </button>

      {/* trending strip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700,
          color: "color-mix(in srgb, var(--cat-trending), var(--text) 16%)" }}>
          <Icon name="flame" size={15} fill="var(--cat-trending)" stroke={0} /> {trending.length} trending now
        </span>
        <SegmentedControl size="sm" value={sort} onChange={setSort}
          options={[{ value: "trending", label: "Trending" }, { value: "recent", label: "Recent" }]} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((f) => <FeedCard key={f.id} item={f} store={store} />)}
      </div>
    </div>
  );
}

function FeedCard({ item, store }) {
  const starred = !!store.state.stars[item.id];
  const inGoing = store.state.rsvp[item.id] === "going";
  const cat = CAT_MAP[item.cat];
  const poster = avatar(item.by);
  return (
    <div className={`cat cat-${item.cat}`} style={{
      position: "relative", borderRadius: "var(--r-lg)", background: "var(--surface)",
      border: "1px solid " + (item.trending ? "var(--c-line)" : "var(--border)"),
      boxShadow: "var(--shadow-sm)", padding: 16, overflow: "hidden",
    }}>
      {item.trending && (
        <span style={{ position: "absolute", top: 0, left: 0, width: 3, bottom: 0, background: "var(--c)" }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
        <Avatar person={poster} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{item.by}</div>
          <div style={{ fontSize: 12, color: "var(--text-3)" }}>{item.when}</div>
        </div>
        <CategoryBadge cat={item.cat} size="sm" />
        {item.trending && <Badge tone="trending" icon="flame" size="sm">Hot</Badge>}
      </div>

      <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 700, lineHeight: 1.25 }}>{item.title}</h3>
      <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.55, color: "var(--text-2)" }}>{item.body}</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => store.toggleStar(item.id)} style={{
          display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: "var(--r-pill)",
          fontSize: 13, fontWeight: 700, transition: "all .15s",
          border: "1px solid " + (starred ? "color-mix(in srgb, var(--cat-academic) 45%, var(--border))" : "var(--border)"),
          background: starred ? "color-mix(in srgb, var(--cat-academic) 15%, var(--surface))" : "var(--surface)",
          color: starred ? "color-mix(in srgb, var(--cat-academic), var(--text) 20%)" : "var(--text-2)" }}>
          <Icon name="star" size={15} fill={starred ? "var(--cat-academic)" : "none"}
            style={{ color: starred ? "var(--cat-academic)" : "currentColor" }} />
          {store.starCount(item)}
        </button>
        {item.going > 0 && (
          <button onClick={() => store.setRsvp(item.id, "going")} style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: "var(--r-pill)",
            fontSize: 13, fontWeight: 700, transition: "all .15s",
            border: "1px solid " + (inGoing ? "color-mix(in srgb, var(--cat-sports) 45%, var(--border))" : "var(--border)"),
            background: inGoing ? "color-mix(in srgb, var(--cat-sports) 15%, var(--surface))" : "var(--surface)",
            color: inGoing ? "color-mix(in srgb, var(--cat-sports), var(--text) 20%)" : "var(--text-2)",
            whiteSpace: "nowrap" }}>
            <Icon name="check" size={15} stroke={2.6} /> {inGoing ? "I'm in" : "Count me in"} · {item.going + (inGoing ? 1 : 0)}
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--text-3)",
          display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="compass" size={14} /> Community
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { FeedScreen, FeedCard });
