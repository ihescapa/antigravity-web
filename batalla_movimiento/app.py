import streamlit as st
import os
import base64
from pathlib import Path
from datetime import datetime

# --- PAGE CONFIG ---
st.set_page_config(
    page_title="ARK-V12.1 | Research & Collaboration Hub",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- PASSWORD PROTECTION ---
def check_password():
    def password_entered():
        if st.session_state["password"] == "MEF2026":
            st.session_state["password_correct"] = True
            del st.session_state["password"]
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        st.markdown("""
            <div style="display: flex; justify-content: center; align-items: center; height: 70vh; flex-direction: column; text-align: center;">
                <h1 style="color: #D4AF37; font-family: 'Outfit'; font-size: 5rem; margin-bottom: 0;">ARK</h1>
                <p style="color: #444; font-family: 'Fira Code'; letter-spacing: 15px; text-transform: uppercase; margin-bottom: 3rem;">Data Vault Access</p>
                <div style="background: #0A0A0C; padding: 3rem; border-radius: 20px; border: 1px solid #1A1A1D; width: 400px;">
                    <p style="color: #888; font-size: 0.8rem; margin-bottom: 2rem;">INGRESE CREDENCIAL DEL PROYECTO</p>
                </div>
            </div>
        """, unsafe_allow_html=True)
        st.text_input("Credencial", type="password", on_change=password_entered, key="password", label_visibility="collapsed")
        if "password_correct" in st.session_state and not st.session_state["password_correct"]:
            st.error("Acceso denegado. Credencial no válida.")
        return False
    return True

if not check_password():
    st.stop()

# --- THEME & CSS (V12.1 PROFESSIONAL HUB) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&family=Inter:wght@300;400;600;700&family=Outfit:wght@300;400;700;900&display=swap');
    
    :root {
        --bg: #030304;
        --card: #0A0A0C;
        --accent: #D4AF37;
        --accent-glow: rgba(212, 175, 55, 0.1);
        --text: #F0F0F0;
    }

    .main { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; }
    h1, h2, h3 { font-family: 'Outfit', sans-serif; letter-spacing: -2.5px; }
    h1 { font-size: 5rem !important; font-weight: 900; color: var(--accent); line-height: 0.8; margin-bottom: 3rem !important; }
    h2 { font-size: 2.8rem !important; color: #FFF; margin-top: 3rem !important; border-left: 6px solid var(--accent); padding-left: 1.5rem; }
    
    .vault-card {
        background: var(--card);
        border: 1px solid #1A1A1D;
        padding: 4rem;
        border-radius: 24px;
        margin-bottom: 3rem;
        box-shadow: 0 40px 80px rgba(0,0,0,0.8);
    }
    
    .sci-tag {
        font-family: 'Fira Code', monospace;
        font-size: 0.7rem;
        color: var(--accent);
        background: var(--accent-glow);
        padding: 5px 15px;
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 2rem;
    }

    .upload-zone {
        border: 2px dashed #333;
        padding: 4rem;
        border-radius: 20px;
        background: #000;
        text-align: center;
    }

    /* Tabs UI */
    .stTabs [data-baseweb="tab-list"] { background: transparent; gap: 40px; }
    .stTabs [data-baseweb="tab"] { font-size: 1.3rem; font-weight: 900; color: #444; height: 70px; }
    .stTabs [aria-selected="true"] { color: var(--accent) !important; border-bottom-color: var(--accent) !important; }

    </style>
    """, unsafe_allow_html=True)

# --- HELPERS ---
def load_ark(sector, file):
    path = Path(__file__).parent / "context" / sector / file
    if path.exists():
        return path.read_text(encoding="utf-8")
    return f"[[ ERROR: SECTOR {sector.upper()} / FALLA DE ACCESO AL ARCHIVO ]]"

def get_dl_btn(path, label='ARK'):
    with open(path, 'rb') as f: data = f.read()
    b64 = base64.b64encode(data).decode()
    return f'<a href="data:application/octet-stream;base64,{b64}" download="{os.path.basename(path)}" style="text-decoration: none; color: black; background: #D4AF37; padding: 10px 20px; border-radius: 6px; font-weight: 900; font-size: 0.8rem; display: block; text-align: center;">VINCULAR {label.upper()}</a>'

# --- INTERFACE ARK V12 ---
st.sidebar.markdown(f"""
    <div style="padding: 2.5rem 0; text-align: center;">
        <h1 style="font-size: 3rem !important; margin: 0; color: #D4AF37;">ARK-V12.1</h1>
        <p style="font-size: 0.6rem; letter-spacing: 12px; color: #444; text-transform: uppercase;">Professional Hub</p>
    </div>
""", unsafe_allow_html=True)

menu = st.sidebar.radio("Sectores del Hub", 
    ["🌍 Contexto: Patagonia Jurásica",
     "🧬 Archivo Científico (Papers)",
     "🏛️ Guion de Museología", 
     "🧠 Ideario & Diseño",
     "📤 Carga Colaborativa",
     "📦 Repositorio Central"])

st.markdown(f"<h1>{menu[4:]}</h1>", unsafe_allow_html=True)

# --- SECTION: JURASSIC CONTEXT ---
if menu == "🌍 Contexto: Patagonia Jurásica":
    st.markdown("### Geología, Paleobotánica y Supervivencia")
    t1, t2 = st.tabs(["Simbiosis & Resiliencia", "La Formación La Matilde"])
    
    with t1:
        st.markdown(f"""<div class="vault-card">
            <span class="sci-tag">REPORTE CIENTÍFICO: SIMBIOSIS MICORRÍCICA</span>
            {load_ark('papers', 'symbiosis_v12.txt')}
        </div>""", unsafe_allow_html=True)
    
    with t2:
        st.markdown(f"""<div class="vault-card">
            <span class="sci-tag">REPORTE GEOLÓGICO: ESTRATIGRAFÍA VOLCÁNICA</span>
            {load_ark('papers', 'patagonia_jurassica_v12.txt')}
        </div>""", unsafe_allow_html=True)

# --- SECTION: SCIENTIFIC ARCHIVE ---
elif menu == "🧬 Archivo Científico (Papers)":
    st.markdown("### Documentación Verificada del Grupo de Investigación")
    
    with st.container():
        st.markdown(f"""<div class="vault-card">
            <span class="sci-tag">BIBLIOGRAFÍA REVISADA (v12)</span>
            {load_ark('papers', 'bibliography_v12.txt')}
        </div>""", unsafe_allow_html=True)
        
    cols = st.columns(2)
    with cols[0]:
        st.markdown(f"""<div class="vault-card" style="padding: 2.5rem; font-size: 0.95rem;">
            <span class="sci-tag">ENSAYO BIOMECÁNICO</span>
            {load_ark('papers', 'evolution_of_movement_v11.txt')[:1500]}...
        </div>""", unsafe_allow_html=True)
    with cols[1]:
        st.markdown(f"""<div class="vault-card" style="padding: 2.5rem; font-size: 0.95rem;">
            <span class="sci-tag">GALERÍA DE LINAJES</span>
            {load_ark('papers', 'lineage_gallery_v11.txt')[:1500]}...
        </div>""", unsafe_allow_html=True)

# --- SECTION: MUSEOLOGY ---
elif menu == "🏛️ Guion de Museología":
    st.markdown("### Estructura Narrativa y Técnica de la Muestra")
    tabs = st.tabs(["Guion Maestro V11.1 (6 Salas)", "Script Narrativo (Krapovickas)"])
    
    with tabs[0]:
        guion = load_ark('scripts', 'exhibition_signage_v11.txt')
        for sala in guion.split("---"):
            if "##" in sala:
                st.markdown(f"""<div class="vault-card">{sala}</div>""", unsafe_allow_html=True)
    with tabs[1]:
        st.markdown(f"""<div class="vault-card" style="font-family: serif; color: #888;">{load_ark('scripts', 'narrative_script.txt')}</div>""", unsafe_allow_html=True)

# --- SECTION: IDEOLOGY ---
elif menu == "🧠 Ideario & Diseño":
    st.markdown("### Identidad Visual y Pensamiento")
    c1, c2 = st.columns([2, 1])
    with c1:
        st.markdown(f"""<div class="vault-card">
            <span class="sci-tag">FILOSOFÍA DEL PROYECTO</span>
            {load_ark('conceptual', 'ideario_v11.txt')}
        </div>""", unsafe_allow_html=True)
    with c2:
        st.markdown(f"""<div class="vault-card" style="padding: 2rem; font-size: 0.7rem; font-family: 'Fira Code';">
            <span class="sci-tag">PROMPTS ARTE V11.1</span>
            {load_ark('conceptual', 'art_prompts_v11.txt')}
        </div>""", unsafe_allow_html=True)
        st.markdown(f"""<div class="vault-card" style="padding: 2rem; font-size: 0.9rem;">
            <span class="sci-tag">ANEXO HISTÓRICO</span>
            {load_ark('conceptual', 'anexo_full.txt')[:1000]}...
        </div>""", unsafe_allow_html=True)

# --- SECTION: UPLOAD ---
elif menu == "📤 Carga Colaborativa":
    st.markdown("### Integración de Nueva Evidencia")
    st.markdown("""<div class="upload-zone">
        <p style="color: #555; margin-bottom: 2rem;">SUBIR PDFs, IMÁGENES O DATOS PARA LA BIBLIOTECA DEL PROYECTO</p>
    </div>""", unsafe_allow_html=True)
    
    u_file = st.file_uploader("Arrastre archivos aquí", type=['pdf', 'txt', 'png', 'jpg', 'jpeg'], label_visibility="collapsed")
    if u_file is not None:
        destination = Path(__file__).parent / "context" / "uploaded" / u_file.name
        with open(destination, "wb") as f:
            f.write(u_file.getbuffer())
        st.success(f"Protocolo Completado: '{u_file.name}' archivado en el sector de colaboración.")

# --- SECTION: REPOSITORY ---
elif menu == "📦 Repositorio Central":
    st.markdown("### Descarga Sincronizada del Legado Digital")
    
    sectores = ["papers", "scripts", "conceptual", "uploaded"]
    for s in sectores:
        st.markdown(f"#### Sector: {s.upper()}")
        p = Path(__file__).parent / "context" / s
        if p.exists():
            files = list(p.glob("*"))
            if not files: st.caption("Sector actualmente vacío.")
            cols = st.columns(4)
            for idx, fl in enumerate(files):
                with cols[idx % 4]:
                    st.markdown(f"""<div style="background: #111; padding: 1.5rem; border-radius: 12px; border: 1px solid #1A1A1D; text-align: center; margin-bottom: 1rem;">
                        <p style="font-size: 0.6rem; color: #444; margin-bottom: 1rem;">{fl.name[:25]}</p>
                        {get_dl_btn(str(fl), 'Vincular')}
                    </div>""", unsafe_allow_html=True)

# --- FOOTER ---
st.sidebar.markdown("---")
st.sidebar.caption(f"v12.1 Hub Final · MEF Labs · {datetime.now().year}")
st.sidebar.caption("Secured with ARK Collab Protocol")
