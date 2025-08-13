<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  export let data: { core: any[]; subcore: any[]; grouped: Record<string, any[]>; roles: string[]; error?: boolean };
  let showNav = true;
  let expanded = new Set<string>();
  function toggle(role: string){
    if (expanded.has(role)) {
      expanded.delete(role);
    } else {
      expanded.add(role);
    }
    expanded = new Set(expanded);
  }
</script>

<style>
  :global(body) {
    background: #000;
    color: #fff;
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  .page {
    min-height: 100dvh;
    display: flex;
    padding: 0 clamp(1.25rem, 4vw, 3.5rem);
    box-sizing: border-box;
  }
  .page-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2.5rem;
    padding: 2.25rem 0;
  }
  .header {
    max-width: 880px;
    margin: 0 auto 2.2rem;
    display: flex;
    flex-direction: column;
    gap: 1.05rem;
    text-align: center;
    align-items: center;
  }
  .header h1 {
    font: 700 clamp(2.8rem, 9vw, 5rem)/1.05 system-ui, sans-serif;
    letter-spacing: .05em;
    margin: 0;
    background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58, #4285F4);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: heroShift 8000ms linear infinite;
  }
  .header p {
    margin: 0;
    max-width: 760px;
    font: 400 clamp(.95rem, 1.4vw, 1.05rem)/1.6 system-ui, sans-serif;
    letter-spacing: .015em;
    color: #ddd;
  }
  .sections {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  .grid {
    --min: 210px;
    display: grid;
    gap: 1.4rem;
    grid-template-columns: repeat(auto-fill, minmax(var(--min), 1fr));
  }
  .person {
    position: relative;
    background: #111;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    padding: 1rem .95rem 1.1rem;
    display: flex;
    gap: .9rem;
    align-items: center;
    overflow: hidden;
    transition: transform .55s cubic-bezier(.16, .84, .31, 1), border-color .55s;
  }
  .person:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.16);
  }
  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #222, #333);
    flex: 0 0 auto;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    font: 600 .75rem/1 system-ui, sans-serif;
    letter-spacing: .08em;
    color: #999;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(.92);
  }
  .person .meta {
    display: flex;
    flex-direction: column;
    gap: .4rem;
  }
  .person .meta h3 {
    margin: 0;
    font: 600 .95rem/1.2 system-ui, sans-serif;
    letter-spacing: .04em;
  }
  .person .meta p {
    margin: 0;
    font: 400 .7rem/1.3 system-ui, sans-serif;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: #bbb;
  }
  .section-title {
    font: 600 1.05rem/1.1 system-ui, sans-serif;
    letter-spacing: .25em;
    text-transform: uppercase;
    margin: 0 0 1rem;
    color: #eee;
    opacity: .9;
    text-align: center;
  }
  .role-group {
    background: #0d0d0d;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
  }
  .role-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #111;
    padding: 1rem 1.15rem;
    font: 600 .85rem/1 system-ui, sans-serif;
    letter-spacing: .18em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    color: #eee;
    position: relative;
  }
  .role-header:hover {
    background: #151515;
  }
  .role-header span.count {
    font: 500 .65rem/1 system-ui, sans-serif;
    letter-spacing: .12em;
    color: #999;
  }
  .role-header svg {
    width: 18px;
    height: 18px;
    stroke: #aaa;
    stroke-width: 2;
    fill: none;
    transition: transform .4s cubic-bezier(.16, .84, .31, 1);
  }
  .role-header[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
  .members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: .9rem;
    padding: 1rem 1.15rem 1.4rem;
  }
  .member {
    font: 500 .8rem/1.3 system-ui, sans-serif;
    letter-spacing: .03em;
    background: #181818;
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: .65rem .7rem;
    border-radius: 12px;
    color: #ddd;
  }
  .member:hover {
    border-color: rgba(255, 255, 255, 0.18);
  }
  .empty {
    padding: 1rem 1.15rem 1.4rem;
    font: 400 .75rem/1.4 system-ui, sans-serif;
    color: #888;
  }
  @keyframes heroShift {
    to { background-position: 200% 50%; }
  }
  @media (max-width: 700px) {
    .page { padding: 0 1rem; }
    .page-inner { 
        padding: 4.5rem 0 3.25rem;
         gap: 2.25rem;
         }
    .grid { gap: 1rem; }
  }
  @media (min-width: 900px) {
    .page { padding: 0 clamp(2rem, 4vw, 4.5rem); }
    .page-inner { padding: 2.75rem 0; }
  }
  @media (min-width: 1200px) {
    .page {
      padding: 0 clamp(2.5rem, 5vw, 5rem);
    }
    .page-inner {
      margin: 0 auto;
      max-width: 1550px;
      padding: 3rem 0;
    }
    .sections {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 3.5rem 2.5rem;
      align-items: start;
    }
    .core-section, .subcore-section {
      grid-column: span 6;
    }
    .tracks-section {
      grid-column: 1 / -1;
    }
    .grid {
      --min: 190px;
      gap: 1.15rem;
    }
    .core-section {
      position: relative;
      padding-right: 2.2rem;
    }
    .subcore-section {
      padding-left: 2.2rem;
    }
    .core-section::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.15) 85%, rgba(255,255,255,0));
      pointer-events: none;
    }
  }
</style>

<div class="page">
  <div class="page-inner">
  <section class="header">
    <h1>Team</h1>
    <p>People who build, design, debug, ship & keep the community moving. Core, subcore & every member.</p>
  </section>
  {#if data.error}
    <p style="text-align:center;color:#f77;">Failed to load team data.</p>
  {:else}
  <div class="sections">
  <div class="core-section">
      <h2 class="section-title">Core</h2>
      <div class="grid">
        {#each data.core as m}
          <div class="person" title={m.role}>
            <div class="avatar">{#if m.avatar}<img src={m.avatar} alt={m.name} loading="lazy" />{:else}{m.name.slice(0,2).toUpperCase()}{/if}</div>
            <div class="meta">
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
    {#if data.subcore.length}
  <div class="subcore-section">
      <h2 class="section-title">Subcore</h2>
      <div class="grid">
        {#each data.subcore as m}
          <div class="person" title={m.role}>
            <div class="avatar">{#if m.avatar}<img src={m.avatar} alt={m.name} loading="lazy" />{:else}{m.name.slice(0,2).toUpperCase()}{/if}</div>
            <div class="meta">
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
    {/if}
  <div class="tracks-section">
      <h2 class="section-title" style="margin-top:.5rem;">Members</h2>
      <div style="display:flex; flex-direction:column; gap:1rem;">
        {#each data.roles as role}
          <div class="role-group">
            <button class="role-header" aria-expanded={expanded.has(role)} on:click={() => toggle(role)}>
              <span>{role}</span>
              <span class="count">{data.grouped[role].length}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            {#if expanded.has(role)}
              {#if data.grouped[role].length}
                <div class="members">
                  {#each data.grouped[role] as member}
                    <div class="member">{member.name}</div>
                  {/each}
                </div>
              {:else}
                <div class="empty">No members.</div>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
  {/if}
  </div>
</div>
<Nav visible={showNav} />
