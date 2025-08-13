<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  let showNav = true;
  const email = 'dsc.club@snu.edu.in';
  const instagram = 'https://www.instagram.com/gdsc.snioe/';
  interface PhoneContact { name:string; role:string; phone:string }
  const phones: PhoneContact[] = [
    { name: 'Pustak Patak', role: 'Lead', phone: '+91 74793 34559' },
    { name: 'Navya Jain', role: 'Advisor', phone: '+91 97739 03680' },
    { name: 'Manan Raina', role: 'Deputy Lead', phone: '+91 85951 54723' },
    { name: 'Tilika Chopra', role: 'Coordinator', phone: '+91 98111 75334' }
  ];
</script>

<style>
  :global(body) {
    background:#000;
    color:#fff;
    margin:0;
    font-family:system-ui,sans-serif;
  }
  .page-wrap {
    min-height:100svh;
    padding:0 1.25rem 4rem;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
  }
  .hero {
    font:700 clamp(2.8rem,9vw,5rem)/1.05 system-ui,sans-serif;
    letter-spacing:.05em;
    background:linear-gradient(90deg,#4285F4,#DB4437,#F4B400,#0F9D58,#4285F4);
    background-size:200% auto;
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
    animation:heroShift 8000ms linear infinite;
    margin:0 0 1.25rem;
  }
  .sub {
    max-width:680px;
    font:400 clamp(.95rem,1.4vw,1.05rem)/1.6 system-ui,sans-serif;
    letter-spacing:.015em;
    margin:0 0 2.4rem;
    color:#ddd;
  }
  .links {
    display:flex;
    flex-direction:column;
    gap:1.1rem;
    width:100%;
    max-width:560px;
  }
  .phones {
    margin-top:2.8rem;
    display:grid;
    gap:1rem;
    grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
    width:100%;
    max-width:860px;
  }
  .phones h2 {
    grid-column:1/-1;
    font:600 .85rem/1 system-ui,sans-serif;
    letter-spacing:.25em;
    text-transform:uppercase;
    margin:0 0 .75rem;
    color:#ccc;
    text-align:center;
  }
  .phone-card {
    position:relative;
    background:#111;
    border:1px solid rgba(255,255,255,0.08);
    border-radius:18px;
    padding:.95rem 1.05rem 1.05rem;
    display:flex;
    flex-direction:column;
    gap:.55rem;
    transition:
      transform .55s cubic-bezier(.16,.84,.31,1),
      border-color .45s,
      background .45s;
    overflow:hidden;
  }
  .phone-card::before {
    content: "";
    position:absolute;
    inset:0;
    background:
      linear-gradient(120deg,
        rgba(66,133,244,0.12),
        rgba(219,68,55,0.10),
        rgba(244,180,0,0.10),
        rgba(15,157,88,0.12)
      );
    opacity:0;
    transition:opacity .6s;
    pointer-events:none;
  }
  .phone-card:hover {
    transform:translateY(-4px);
    border-color:rgba(255,255,255,0.16);
  }
  .phone-card:hover::before {
    opacity:1;
  }
  .phone-head {
    display:flex;
    align-items:center;
    gap:.65rem;
  }
  .phone-icon {
    width:38px;
    height:38px;
    border-radius:12px;
    background:#181818;
    border:1px solid rgba(255,255,255,0.08);
    display:grid;
    place-items:center;
    flex:0 0 auto;
  }
  .phone-icon svg {
    width:20px;
    height:20px;
    stroke:#fff;
    stroke-width:1.7;
    fill:none;
  }
  .phone-meta h3 {
    margin:0;
    font:600 .85rem/1.15 system-ui,sans-serif;
    letter-spacing:.05em;
  }
  .phone-meta p {
    margin:0;
    font:400 .65rem/1.2 system-ui,sans-serif;
    letter-spacing:.1em;
    text-transform:uppercase;
    color:#aaa;
  }
  .dial {
    font:600 .8rem/1.2 ui-monospace,monospace;
    letter-spacing:.08em;
    color:#89c2ff;
    text-decoration:none;
    word-break:break-all;
  }
  .dial:hover {
    text-decoration:underline;
  }
  .link-card {
    position:relative;
    background:#111;
    border:1px solid rgba(255,255,255,0.08);
    border-radius:18px;
    padding:1.15rem 1.35rem 1.25rem;
    text-align:left;
    display:flex;
    align-items:center;
    gap:1rem;
    transition:
      transform .55s cubic-bezier(.16,.84,.31,1),
      border-color .45s,
      background .45s;
    overflow:hidden;
  }
  .link-card::before {
    content: "";
    position:absolute;
    inset:0;
    background:
      linear-gradient(120deg,
        rgba(66,133,244,0.14),
        rgba(219,68,55,0.12),
        rgba(244,180,0,0.12),
        rgba(15,157,88,0.12)
      );
    opacity:0;
    transition:opacity .6s;
    pointer-events:none;
  }
  .link-card:hover::before {
    opacity:1;
  }
  .link-card:hover {
    transform:translateY(-5px);
    border-color:rgba(255,255,255,0.18);
  }
  .icon {
    width:46px;
    height:46px;
    flex:0 0 auto;
    border-radius:14px;
    display:grid;
    place-items:center;
    background:#181818;
    border:1px solid rgba(255,255,255,0.08);
  }
  .icon svg {
    width:24px;
    height:24px;
    stroke:#fff;
    stroke-width:1.8;
    fill:none;
  }
  .info h3 {
    margin:0 0 .4rem;
    font:600 .95rem/1.2 system-ui,sans-serif;
    letter-spacing:.05em;
  }
  .info p {
    margin:0;
    font:400 .75rem/1.4 system-ui,sans-serif;
    letter-spacing:.04em;
    color:#bbb;
  }
  a.link-card {
    text-decoration:none;
    color:inherit;
  }
  .addr {
    font:600 .8rem/1.2 system-ui,sans-serif;
    letter-spacing:.1em;
    color:#89c2ff;
    word-break:break-all;
  }
  @keyframes heroShift {
    to {
      background-position:200% 50%;
    }
  }
  @media (max-width:700px) {
    .page-wrap {
      padding:0 1rem 3.5rem;
    }
    .links {
      gap:.9rem;
    }
    .phones {
      grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
      gap:.85rem;
    }
  }
</style>

<div class="page-wrap">
  <h1 class="hero">Contact</h1>
  <p class="sub">Reach out for collaborations, events, speaking, or just to say hi. We read every message that’s not obviously from an LLM 😉.</p>
  <div class="links">
    <a class="link-card" href={`mailto:${email}`} aria-label="Email">
      <div class="icon">
        <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z" stroke-linejoin="round"/><path d="M4 6l8 7 8-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="info">
        <h3>Email</h3>
        <p class="addr">{email}</p>
        <p>Drop us a line for anything community or dev related.</p>
      </div>
    </a>
    <a class="link-card" href={instagram} target="_blank" rel="noopener" aria-label="Instagram">
      <div class="icon">
        <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="4.2"/><circle cx="17" cy="7" r="1.2" fill="#fff" stroke="none"/></svg>
      </div>
      <div class="info">
        <h3>Instagram</h3>
        <p>@gdsc.snioe</p>
        <p>Stories, recaps & tiny behind the scenes drops.</p>
      </div>
    </a>
  </div>
  {#if phones.length}
  <div class="phones">
    <h2>Core Contacts</h2>
    {#each phones as p}
      <div class="phone-card">
        <div class="phone-head">
          <div class="phone-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6.5 3.5l3 1.2c.3.12.5.4.5.7 0 1.1-.25 2.1-.75 3.1-.1.2-.1.5.05.7.9 1.5 2.15 2.75 3.65 3.65.2.15.5.15.7.05 1-.5 2-.75 3.1-.75.3 0 .6.2.7.5l1.2 3c.15.35.05.75-.25 1-.9.7-2 1.1-3.15 1.1C10.8 21.5 4.5 15.2 4.5 7.9c0-1.15.4-2.25 1.1-3.15.25-.3.65-.4 1-.25z" stroke-linejoin="round"/></svg>
          </div>
          <div class="phone-meta">
            <h3>{p.name}</h3>
            <p>{p.role}</p>
          </div>
        </div>
        <a class="dial" href={`tel:${p.phone.replace(/\\s+/g,'')}`}>{p.phone}</a>
      </div>
    {/each}
  </div>
  {/if}
</div>
<Nav visible={showNav} />
