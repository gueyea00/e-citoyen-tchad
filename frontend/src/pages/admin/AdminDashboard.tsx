import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  LogOut, LayoutDashboard, Globe, FileText, Briefcase,
  Building2, Plus, Pencil, Trash2, Save, X, ChevronRight,
  CheckCircle, AlertCircle, Search, Languages, Eye, EyeOff, RefreshCw
} from "lucide-react";

// ─────────────────────── Types ─────────────────────── //
interface Service {
  id: string;
  titre_fr: string;
  titre_ar?: string;
  titre_en?: string;
  desc_fr: string;
  desc_ar?: string;
  desc_en?: string;
  slug: string;
  direction_id: string;
  direction?: Direction;
  etapes?: Etape[];
  videos?: Video[];
}
interface Etape {
  id?: string;
  ordre: number;
  titre_fr: string;
  titre_ar?: string;
  titre_en?: string;
  desc_fr: string;
  desc_ar?: string;
  desc_en?: string;
  duree?: string;
  docs_requis?: string;
}
interface Video {
  id?: string;
  langue: string;
  url: string;
  type: string;
  titre?: string;
}
interface Direction { id: string; nom_fr: string; nom_ar?: string; nom_en?: string; adresse?: string; telephone?: string; email?: string; horaires?: string; }
interface Document { id: string; titre_fr: string; fichier_url: string; format: string; langues: string[]; taille?: number; }

// ─────────────────────── Composants UI ───────────────────────
const Badge = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span className={`cms-badge cms-badge-${color}`}>{children}</span>
);

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="cms-modal-overlay">
    <div className="cms-modal">
      <div className="cms-modal-header">
        <h3>{title}</h3>
        <button onClick={onClose} className="cms-modal-close"><X size={18} /></button>
      </div>
      <div className="cms-modal-body">{children}</div>
    </div>
  </div>
);

// ─────────────────────── Sections ───────────────────────

// SERVICES SECTION
function ServicesSection({ token }: { token: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sv, dir] = await Promise.all([
        apiClient.fetch("/admin/services", { headers: { Authorization: `Bearer ${token}` } }),
        apiClient.fetch("/admin/directions", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (Array.isArray(sv)) setServices(sv);
      if (Array.isArray(dir)) setDirections(dir);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = services.filter(s =>
    s.titre_fr.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditItem({
      titre_fr: "",
      slug: "",
      desc_fr: "",
      direction_id: directions[0]?.id || "",
      etapes: [],
      videos: [
        { langue: 'fr', url: '', type: 'youtube' }
      ]
    });
    setShowModal(true);
  };
  const openEdit = (s: Service) => {
    setEditItem({
      ...s,
      etapes: s.etapes || [],
      videos: s.videos && s.videos.length > 0 ? s.videos.filter(v => v.langue === 'fr') : [
        { langue: 'fr', url: '', type: 'youtube' }
      ]
    });
    setShowModal(true);
  };

  const addEtape = () => {
    if (!editItem) return;
    const currentEtapes = editItem.etapes || [];
    const nextOrder = currentEtapes.length + 1;
    setEditItem({
      ...editItem,
      etapes: [...currentEtapes, { ordre: nextOrder, titre_fr: "", desc_fr: "" }]
    });
  };

  const updateEtape = (index: number, field: keyof Etape, value: any) => {
    if (!editItem || !editItem.etapes) return;
    const newEtapes = [...editItem.etapes];
    newEtapes[index] = { ...newEtapes[index], [field]: value };
    setEditItem({ ...editItem, etapes: newEtapes });
  };

  const removeEtape = (index: number) => {
    if (!editItem || !editItem.etapes) return;
    const newEtapes = editItem.etapes.filter((_, i) => i !== index)
      .map((e, i) => ({ ...e, ordre: i + 1 }));
    setEditItem({ ...editItem, etapes: newEtapes });
  };

  const updateVideo = (lang: string, url: string) => {
    if (!editItem || !editItem.videos) return;
    const newVideos = [...editItem.videos];
    const idx = newVideos.findIndex(v => v.langue === lang);
    if (idx !== -1) {
      newVideos[idx] = { ...newVideos[idx], url };
    } else {
      newVideos.push({ langue: lang, url, type: 'youtube' });
    }
    setEditItem({ ...editItem, videos: newVideos });
  };

  const save = async () => {
    if (!editItem) return;
    setSaving(true);
    
    // Ensure slug is trimmed and properly formatted
    const payload = {
      ...editItem,
      slug: editItem.slug?.trim()
    };

    try {
      if (editItem.id) {
        await apiClient.fetch(`/admin/services/${editItem.id}`, { 
          method: "PUT", 
          headers: { Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        toast.success("Service mis à jour !");
      } else {
        await apiClient.fetch(`/admin/services`, { 
          method: "POST", 
          headers: { Authorization: `Bearer ${token}` }, 
          body: JSON.stringify(payload) 
        });
        toast.success("Service créé !");
      }
      setShowModal(false); setEditItem(null); fetchAll();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ? Cette action est irréversible.`)) return;
    try {
      await apiClient.fetch(`/admin/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("Service supprimé."); fetchAll();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="cms-section">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">Gestion des Services</h2>
          <p className="cms-section-subtitle">{services.length} service(s) dans la base de données</p>
        </div>
        <div className="cms-header-actions">
          <div className="cms-search-box">
            <Search size={16} className="cms-search-icon" />
            <input className="cms-search-input" placeholder="Rechercher un service..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button className="cms-btn-primary" onClick={openCreate}><Plus size={16} /> Nouveau Service</Button>
        </div>
      </div>

      {loading ? (
        <div className="cms-loading"><RefreshCw className="cms-spin" size={24} /><span>Chargement...</span></div>
      ) : (
        <div className="cms-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Titre (FR)</th>
                <th>Slug</th>
                <th>Direction</th>
                <th>Étapes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(svc => (
                <tr key={svc.id}>
                  <td className="cms-td-primary">{svc.titre_fr}</td>
                  <td><code className="cms-code">{svc.slug}</code></td>
                  <td><Badge color="blue">{svc.direction?.nom_fr || "—"}</Badge></td>
                  <td><Badge color="purple">{svc.etapes?.length || 0} étapes</Badge></td>
                  <td className="cms-td-actions">
                    <button className="cms-btn-icon cms-btn-edit" onClick={() => openEdit(svc)}><Pencil size={15} /></button>
                    <button className="cms-btn-icon cms-btn-delete" onClick={() => remove(svc.id, svc.titre_fr)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="cms-empty">Aucun service trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && editItem && (
        <Modal title={editItem.id ? "Modifier le Service" : "Nouveau Service"} onClose={() => { setShowModal(false); setEditItem(null); }}>
          <div className="cms-form-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <h4 style={{ color: '#818cf8', fontSize: '14px', fontWeight: '700' }}>Informations Générales</h4>
          </div>
          <div className="cms-form-grid">
            <div className="cms-form-group">
              <label>Titre (Français) *</label>
              <Input value={editItem.titre_fr || ""} onChange={e => setEditItem({ ...editItem, titre_fr: e.target.value })} placeholder="Titre en français" />
            </div>
            <div className="cms-form-group">
              <label>Slug (URL) *</label>
              <Input value={editItem.slug || ""} onChange={e => setEditItem({ ...editItem, slug: e.target.value })} placeholder="mon-service" />
            </div>
            <div className="cms-form-group cms-span-2">
              <label>Description (Français) *</label>
              <Textarea value={editItem.desc_fr || ""} onChange={e => setEditItem({ ...editItem, desc_fr: e.target.value })} rows={3} placeholder="Description en français" />
            </div>
            <div className="cms-form-group cms-span-2">
              <label>Direction Associée *</label>
              <select className="cms-select" value={editItem.direction_id || ""} onChange={e => setEditItem({ ...editItem, direction_id: e.target.value })}>
                <option value="">-- Sélectionner une direction --</option>
                {directions.map(d => <option key={d.id} value={d.id}>{d.nom_fr}</option>)}
              </select>
            </div>
          </div>

          <div className="cms-form-tabs" style={{ display: 'flex', gap: '10px', marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <h4 style={{ color: '#818cf8', fontSize: '14px', fontWeight: '700' }}>Processus (Étapes)</h4>
          </div>

          <div className="cms-etapes-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {editItem.etapes?.map((etape, idx) => (
              <div key={idx} className="cms-etape-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>Étape {etape.ordre}</span>
                  <button onClick={() => removeEtape(idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                <div className="cms-form-grid">
                  <div className="cms-form-group">
                    <label>Titre (FR)</label>
                    <Input value={etape.titre_fr} onChange={e => updateEtape(idx, 'titre_fr', e.target.value)} />
                  </div>
                  <div className="cms-form-group">
                    <label>Durée (ex: 2 jours)</label>
                    <Input value={etape.duree || ""} onChange={e => updateEtape(idx, 'duree', e.target.value)} />
                  </div>
                  <div className="cms-form-group cms-span-2">
                    <label>Description (FR)</label>
                    <Textarea value={etape.desc_fr} onChange={e => updateEtape(idx, 'desc_fr', e.target.value)} rows={2} />
                  </div>
                  <div className="cms-form-group cms-span-2">
                    <label>Documents requis (FR)</label>
                    <Input value={etape.docs_requis || ""} onChange={e => updateEtape(idx, 'docs_requis', e.target.value)} placeholder="ex: Carte d'identité, Formulaire A" />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addEtape} className="cms-btn-secondary" style={{ width: 'fit-content' }}>
              <Plus size={16} /> Ajouter une étape
            </Button>
          </div>

          <div className="cms-form-tabs" style={{ display: 'flex', gap: '10px', marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <h4 style={{ color: '#818cf8', fontSize: '14px', fontWeight: '700' }}>Vidéos Explicatives</h4>
          </div>
          <div className="cms-form-grid">
            <div className="cms-form-group">
              <label>Lien Vidéo Explicative (YouTube)</label>
              <Input
                value={editItem.videos?.find(v => v.langue === 'fr')?.url || ""}
                onChange={e => updateVideo('fr', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="cms-modal-footer">
            <Button variant="outline" onClick={() => { setShowModal(false); setEditItem(null); }}>Annuler</Button>
            <Button className="cms-btn-primary" onClick={save} disabled={saving}>
              {saving ? <RefreshCw className="cms-spin" size={16} /> : <Save size={16} />} Enregistrer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// DIRECTIONS SECTION
function DirectionsSection({ token }: { token: string }) {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Direction> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetch("/admin/directions", { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(data)) setDirections(data);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setEditItem({ nom_fr: "", adresse: "", telephone: "", email: "", horaires: "" }); setShowModal(true); };
  const openEdit = (d: Direction) => { setEditItem({ ...d }); setShowModal(true); };

  const save = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      if (editItem.id) {
        await apiClient.fetch(`/admin/directions/${editItem.id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(editItem) });
        toast.success("Direction mise à jour !");
      } else {
        await apiClient.fetch(`/admin/directions`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(editItem) });
        toast.success("Direction créée !");
      }
      setShowModal(false); setEditItem(null); fetchAll();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (id: string, nom: string) => {
    if (!confirm(`Supprimer "${nom}" ?`)) return;
    try {
      await apiClient.fetch(`/admin/directions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("Direction supprimée."); fetchAll();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="cms-section">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">Gestion des Directions</h2>
          <p className="cms-section-subtitle">{directions.length} direction(s)</p>
        </div>
        <Button className="cms-btn-primary" onClick={openCreate}><Plus size={16} /> Nouvelle Direction</Button>
      </div>

      {loading ? (
        <div className="cms-loading"><RefreshCw className="cms-spin" size={24} /><span>Chargement...</span></div>
      ) : (
        <div className="cms-cards-grid">
          {directions.map(dir => (
            <div key={dir.id} className="cms-dir-card">
              <div className="cms-dir-card-header">
                <Building2 size={20} className="cms-dir-icon" />
                <span className="cms-dir-name">{dir.nom_fr}</span>
              </div>
              {dir.adresse && <div className="cms-dir-info"><span className="cms-dir-label">Adresse</span> {dir.adresse}</div>}
              {dir.telephone && <div className="cms-dir-info"><span className="cms-dir-label">Tél</span> {dir.telephone}</div>}
              {dir.email && <div className="cms-dir-info"><span className="cms-dir-label">Email</span> {dir.email}</div>}
              {dir.horaires && <div className="cms-dir-info"><span className="cms-dir-label">Horaires</span> {dir.horaires}</div>}
              <div className="cms-dir-actions">
                <button className="cms-btn-icon cms-btn-edit" onClick={() => openEdit(dir)}><Pencil size={15} /></button>
                <button className="cms-btn-icon cms-btn-delete" onClick={() => remove(dir.id, dir.nom_fr)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {directions.length === 0 && <p className="cms-empty">Aucune direction. Créez-en une !</p>}
        </div>
      )}

      {showModal && editItem && (
        <Modal title={editItem.id ? "Modifier la Direction" : "Nouvelle Direction"} onClose={() => { setShowModal(false); setEditItem(null); }}>
          <div className="cms-form-grid">
            <div className="cms-form-group">
              <label>Nom (Français) *</label>
              <Input value={editItem.nom_fr || ""} onChange={e => setEditItem({ ...editItem, nom_fr: e.target.value })} placeholder="Nom en français" />
            </div>
            <div className="cms-form-group cms-span-2">
              <label>Adresse</label>
              <Input value={editItem.adresse || ""} onChange={e => setEditItem({ ...editItem, adresse: e.target.value })} placeholder="Adresse complète" />
            </div>
            <div className="cms-form-group">
              <label>Téléphone</label>
              <Input value={editItem.telephone || ""} onChange={e => setEditItem({ ...editItem, telephone: e.target.value })} placeholder="+235 22 XX XX XX" />
            </div>
            <div className="cms-form-group">
              <label>Email</label>
              <Input value={editItem.email || ""} onChange={e => setEditItem({ ...editItem, email: e.target.value })} placeholder="direction@matuh.td" />
            </div>
            <div className="cms-form-group cms-span-2">
              <label>Horaires</label>
              <Input value={editItem.horaires || ""} onChange={e => setEditItem({ ...editItem, horaires: e.target.value })} placeholder="Lun-Ven : 8h-17h" />
            </div>
          </div>
          <div className="cms-modal-footer">
            <Button variant="outline" onClick={() => { setShowModal(false); setEditItem(null); }}>Annuler</Button>
            <Button className="cms-btn-primary" onClick={save} disabled={saving}>
              {saving ? <RefreshCw className="cms-spin" size={16} /> : <Save size={16} />} Enregistrer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// DOCUMENTS SECTION
function DocumentsSection({ token }: { token: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Document> | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [docs, svcs] = await Promise.all([
        apiClient.fetch("/documents", {}),
        apiClient.fetch("/admin/services", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (Array.isArray(docs)) setDocuments(docs);
      if (Array.isArray(svcs)) setServices(svcs);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setEditItem({ titre_fr: "", format: "PDF", langues: ["fr"], service_id: "" } as any); setFile(null); setShowModal(true); };

  const handleUpload = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(apiClient.getBaseUrl() + "/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return { url: data.url, size: file.size };
    } catch (e: any) {
      toast.error(e.message || "Erreur upload");
      throw e;
    }
  };

  const save = async () => {
    if (!editItem?.titre_fr) return toast.error("Le titre est requis");
    if (!file && !editItem.id) return toast.error("Veuillez sélectionner un fichier");

    setSaving(true);
    try {
      let fileData = { fichier_url: editItem.fichier_url, taille: editItem.taille };

      if (file) {
        const uploaded = await handleUpload();
        if (uploaded) {
          fileData.fichier_url = uploaded.url;
          fileData.taille = uploaded.size;
        }
      }

      const payload = {
        ...editItem,
        ...fileData
      };

      if (editItem.id) {
        // ... (mise à jour non implémentée backend, mais création oui)
      } else {
        await apiClient.fetch(`/admin/documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        toast.success("Document créé !");
      }
      setShowModal(false); setEditItem(null); fetchAll();
    } catch (e: any) { }
    finally { setSaving(false); }
  };

  const remove = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" définitement ?`)) return;
    try {
      await apiClient.fetch(`/admin/documents/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      toast.success("Document supprimé."); fetchAll();
    } catch (e: any) { toast.error(e.message); }
  };

  const filtered = documents.filter(d =>
    d.titre_fr.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (bytes?: number) => bytes ? `${(bytes / 1024).toFixed(1)} KB` : "—";



  return (
    <div className="cms-section">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">Bibliothèque de Documents</h2>
          <p className="cms-section-subtitle">{documents.length} document(s) disponible(s)</p>
        </div>
        <div className="cms-header-actions">
          <div className="cms-search-box">
            <Search size={16} className="cms-search-icon" />
            <input className="cms-search-input" placeholder="Rechercher un document..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button className="cms-btn-primary" onClick={openCreate}><Plus size={16} /> Nouveau Document</Button>
        </div>
      </div>

      {loading ? (
        <div className="cms-loading"><RefreshCw className="cms-spin" size={24} /> Chargement...</div>
      ) : (
        <div className="cms-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Titre (FR)</th>
                <th>Format</th>
                <th>Langues</th>
                <th>Taille</th>
                <th>Service Lié</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => {
                const linkedSvc = services.find(s => s.id === (doc as any).service_id);
                return (
                  <tr key={doc.id}>
                    <td className="cms-td-primary">{doc.titre_fr}</td>
                    <td><Badge color={doc.format === "PDF" ? "red" : "blue"}>{doc.format}</Badge></td>
                    <td className="cms-langs">
                      {doc.langues?.includes("fr") && <Badge color="green">FR</Badge>}
                    </td>
                    <td className="cms-muted">{fmt(doc.taille)}</td>
                    <td>{linkedSvc ? <Badge color="blue">{linkedSvc.titre_fr}</Badge> : "Aucun"}</td>
                    <td style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <a href={`${apiClient.getBaseUrl().replace('/api', '')}/${doc.fichier_url}`} target="_blank" rel="noreferrer" className="cms-link">
                        <Eye size={14} /> Voir
                      </a>
                      <button className="cms-btn-icon cms-btn-delete" onClick={() => remove(doc.id, doc.titre_fr)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="cms-empty">Aucun document.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && editItem && (
        <Modal title={editItem.id ? "Modifier le Document" : "Uploader un Document"} onClose={() => { setShowModal(false); setEditItem(null); setFile(null); }}>
          <div className="cms-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="cms-form-group">
              <label>Titre Principal (Français) *</label>
              <Input value={editItem.titre_fr || ""} onChange={e => setEditItem({ ...editItem, titre_fr: e.target.value })} placeholder="Ex: Formulaire d'urbanisme" />
            </div>

            <div className="cms-form-group">
              <label>Fichier ({editItem.format || "PDF"}) *</label>
              <input type="file" className="cms-select" onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" />
              {file && <span className="cms-save-hint">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>}
            </div>

            <div className="cms-form-group">
              <label>Service Associé (Optionnel)</label>
              <select
                className="cms-select"
                value={(editItem as any).service_id || ""}
                onChange={e => setEditItem({ ...editItem, service_id: e.target.value } as any)}
              >
                <option value="">-- Aucun service --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.titre_fr}</option>)}
              </select>
            </div>

            <div className="cms-form-group">
              <label>Format</label>
              <select className="cms-select" value={editItem.format} onChange={e => setEditItem({ ...editItem, format: e.target.value })}>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
              </select>
            </div>


          </div>
          <div className="cms-modal-footer">
            <Button variant="outline" onClick={() => { setShowModal(false); setEditItem(null); setFile(null); }}>Annuler</Button>
            <Button className="cms-btn-primary" onClick={save} disabled={saving}>
              {saving ? <RefreshCw className="cms-spin" size={16} /> : <Save size={16} />} {saving ? "Upload en cours..." : "Uploader & Enregistrer"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// TEXTES DU SITE SECTION
type LocaleKey = "fr" | "ar" | "en";
const LOCALE_LABELS: Record<LocaleKey, string> = { fr: "🇫🇷 Français", ar: "🇸🇦 Arabe", en: "🇬🇧 Anglais" };

function flattenObj(obj: any, prefix = ""): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObj(obj[key], fullKey));
    } else {
      acc[fullKey] = String(obj[key]);
    }
    return acc;
  }, {});
}

function unflattenObj(flat: Record<string, string>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

import { translations as defaultTranslations } from "@/i18n/translations";

function TextsSection({ token }: { token: string }) {
  const [locale, setLocale] = useState<LocaleKey>("fr");
  const [flatTexts, setFlatTexts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(true);

  // Charge les textes depuis l'API ou les defaults
  const loadTexts = useCallback(async (loc: LocaleKey) => {
    try {
      // Essaie de charger depuis l'API CMS
      const data = await apiClient.fetch(`/admin/content/translations_${loc}`);
      if (data?.value && typeof data.value === "object") {
        setFlatTexts(flattenObj(data.value));
        return;
      }
    } catch {
      // Fallback sur les traductions par défaut
    }
    // Fallback
    setFlatTexts(flattenObj(defaultTranslations[loc]));
  }, []);

  useEffect(() => { loadTexts(locale); }, [locale, loadTexts]);

  const handleChange = (key: string, value: string) => {
    setFlatTexts(prev => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const nested = unflattenObj(flatTexts);
      await apiClient.fetch(`/admin/content/translations_${locale}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: nested })
      });
      toast.success(`Textes ${LOCALE_LABELS[locale]} sauvegardés ! Le site sera mis à jour automatiquement.`);
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const resetDefault = async () => {
    if (!confirm(`Réinitialiser les textes ${LOCALE_LABELS[locale]} aux valeurs par défaut ?`)) return;
    setFlatTexts(flattenObj(defaultTranslations[locale]));
    toast.info("Textes réinitialisés. Cliquez sur Sauvegarder pour confirmer.");
  };

  const filtered = Object.entries(flatTexts).filter(([key, val]) =>
    !searchText || key.toLowerCase().includes(searchText.toLowerCase()) || val.toLowerCase().includes(searchText.toLowerCase())
  );

  // Grouper par section (premier segment de la clé)
  const grouped: Record<string, [string, string][]> = {};
  for (const [key, val] of filtered) {
    const section = key.split(".")[0];
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push([key, val]);
  }

  const sectionLabels: Record<string, string> = {
    platformName: "🏛️ Nom de la plateforme",
    ministryName: "🏛️ Nom du Ministère",
    ministryShort: "🏛️ Nom court du Ministère",
    nav: "🧭 Navigation",
    hero: "🎯 Section Héro",
    informations: "📋 Page Informations",
    serviceDetail: "📝 Détail d'un Service",
    documentation: "📁 Page Documentation",
    chatbot: "🤖 Assistant Virtuel",
    footer: "🦶 Pied de page",
    breadcrumb: "🍞 Fil d'Ariane",
  };

  return (
    <div className="cms-section">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">Textes & Traductions du Site</h2>
          <p className="cms-section-subtitle">Modifiez tous les textes affichés sur le site en temps réel</p>
        </div>
        <div className="cms-header-actions">
          <button className="cms-btn-secondary" onClick={() => setPreviewVisible(!previewVisible)}>
            {previewVisible ? <EyeOff size={16} /> : <Eye size={16} />} Aperçu
          </button>
          <button className="cms-btn-secondary" onClick={resetDefault}><RefreshCw size={16} /> Réinitialiser</button>
          <Button className="cms-btn-primary" onClick={save} disabled={saving}>
            {saving ? <RefreshCw className="cms-spin" size={16} /> : <Save size={16} />} Sauvegarder
          </Button>
        </div>
      </div>

      {/* Barre locale + recherche */}
      <div className="cms-texts-toolbar">
        <div className="cms-locale-tabs">
          <button className="cms-locale-tab cms-locale-tab-active">🇫🇷 Français</button>
        </div>
        <div className="cms-search-box">
          <Search size={16} className="cms-search-icon" />
          <input className="cms-search-input" placeholder="Filtrer les textes..." value={searchText} onChange={e => setSearchText(e.target.value)} />
        </div>
      </div>

      {/* Éditeur de textes par sections */}
      <div className="cms-texts-editor" dir={locale === "ar" ? "rtl" : "ltr"}>
        {Object.entries(grouped).map(([section, entries]) => (
          <div key={section} className="cms-text-section">
            <div className="cms-text-section-title">
              {sectionLabels[section] || `📌 ${section}`}
            </div>
            <div className="cms-text-fields">
              {entries.map(([key, val]) => {
                const fieldLabel = key.split(".").slice(1).join(" › ") || key;
                const isLong = val.length > 80;
                return (
                  <div key={key} className="cms-text-field">
                    <label className="cms-text-label" title={key}>
                      <code className="cms-field-key">{fieldLabel}</code>
                    </label>
                    {isLong ? (
                      <textarea
                        className="cms-text-input cms-text-textarea"
                        value={val}
                        onChange={e => handleChange(key, e.target.value)}
                        rows={3}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                      />
                    ) : (
                      <input
                        className="cms-text-input"
                        value={val}
                        onChange={e => handleChange(key, e.target.value)}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                      />
                    )}
                    {previewVisible && <span className="cms-text-preview">{val}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && <p className="cms-empty">Aucun texte trouvé pour ce filtre.</p>}
      </div>

      <div className="cms-texts-save-bar">
        <Button className="cms-btn-primary" onClick={save} disabled={saving} style={{ minWidth: 200 }}>
          {saving ? <RefreshCw className="cms-spin" size={16} /> : <CheckCircle size={16} />}
          Sauvegarder tous les textes {LOCALE_LABELS[locale]}
        </Button>
        <span className="cms-save-hint">Les modifications sont appliquées sur le site après rechargement de la page.</span>
      </div>
    </div>
  );
}

// ─────────────────────── DASHBOARD STATS ───────────────────────
function DashboardStats({ token }: { token: string }) {
  const [stats, setStats] = useState({ services: 0, directions: 0, documents: 0 });
  useEffect(() => {
    Promise.all([
      apiClient.fetch("/admin/services", { headers: { Authorization: `Bearer ${token}` } }),
      apiClient.fetch("/admin/directions", { headers: { Authorization: `Bearer ${token}` } }),
      apiClient.fetch("/documents", {}),
    ]).then(([sv, dir, doc]) => {
      setStats({
        services: Array.isArray(sv) ? sv.length : 0,
        directions: Array.isArray(dir) ? dir.length : 0,
        documents: Array.isArray(doc) ? doc.length : 0,
      });
    }).catch(() => { });
  }, [token]);

  const cards = [
    { label: "Services en ligne", value: stats.services, icon: <Briefcase size={24} />, color: "blue" },
    { label: "Directions", value: stats.directions, icon: <Building2 size={24} />, color: "green" },
    { label: "Documents", value: stats.documents, icon: <FileText size={24} />, color: "purple" },
  ];

  return (
    <div className="cms-section">
      <h2 className="cms-section-title" style={{ marginBottom: 24 }}>Vue d'ensemble</h2>
      <div className="cms-stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`cms-stat-card cms-stat-${c.color}`}>
            <div className="cms-stat-icon">{c.icon}</div>
            <div className="cms-stat-info">
              <span className="cms-stat-value">{c.value}</span>
              <span className="cms-stat-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="cms-welcome-banner">
        <div className="cms-welcome-icon"><Globe size={28} /></div>
        <div>
          <h3 className="cms-welcome-title">Bienvenue dans le CMS E-Citoyen</h3>
          <p className="cms-welcome-text">
            Gérez tous les contenus, textes, services et directions de votre portail citoyen depuis ce tableau de bord.
            Utilisez l'onglet <strong>Textes du Site</strong> pour modifier n'importe quel texte affiché sur le site.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────── MAIN DASHBOARD ───────────────────────
type Tab = "dashboard" | "services" | "directions" | "documents" | "texts";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
  { id: "services", label: "Services", icon: <Briefcase size={18} /> },
  { id: "directions", label: "Directions", icon: <Building2 size={18} /> },
  { id: "documents", label: "Documents", icon: <FileText size={18} /> },
  { id: "texts", label: "Textes du Site", icon: <Languages size={18} /> },
];

export default function AdminDashboard() {
  const { user, logout, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="cms-root">
      <style>{CMS_STYLES}</style>

      {/* Sidebar */}
      <aside className={`cms-sidebar ${sidebarCollapsed ? "cms-sidebar-collapsed" : ""}`}>
        <div className="cms-sidebar-header">
          <img src="/images/logo.png" alt="Logo" className="cms-logo" />
          {!sidebarCollapsed && <span className="cms-sidebar-brand">E-Citoyen CMS</span>}
        </div>
        <nav className="cms-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`cms-nav-item ${activeTab === item.id ? "cms-nav-item-active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="cms-nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="cms-nav-label">{item.label}</span>}
              {!sidebarCollapsed && activeTab === item.id && <ChevronRight size={14} className="cms-nav-arrow" />}
            </button>
          ))}
        </nav>
        <button className="cms-sidebar-collapse" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <ChevronRight size={16} style={{ transform: sidebarCollapsed ? "none" : "rotate(180deg)", transition: "transform .3s" }} />
          {!sidebarCollapsed && <span>Réduire</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="cms-main">
        {/* Topbar */}
        <header className="cms-topbar">
          <div className="cms-topbar-left">
            <h1 className="cms-topbar-title">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="cms-topbar-right">
            <div className="cms-user-chip">
              <div className="cms-user-avatar">{user?.email?.[0]?.toUpperCase() || "A"}</div>
              <div className="cms-user-info">
                <span className="cms-user-email">{user?.email || "admin@matuh.td"}</span>
                <span className="cms-user-role">{user?.role || "SUPER_ADMIN"}</span>
              </div>
            </div>
            <button className="cms-logout-btn" onClick={logout}>
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="cms-content">
          {activeTab === "dashboard" && <DashboardStats token={token || ""} />}
          {activeTab === "services" && <ServicesSection token={token || ""} />}
          {activeTab === "directions" && <DirectionsSection token={token || ""} />}
          {activeTab === "documents" && <DocumentsSection token={token || ""} />}
          {activeTab === "texts" && <TextsSection token={token || ""} />}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────── STYLES ───────────────────────
const CMS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .cms-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #0f0f1a;
    color: #e2e8f0;
  }

  /* SIDEBAR */
  .cms-sidebar {
    width: 260px;
    min-height: 100vh;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    border-right: 1px solid rgba(255,255,255,0.07);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  .cms-sidebar-collapsed { width: 68px; }
  .cms-sidebar-header {
    padding: 20px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    min-height: 72px;
  }
  .cms-logo { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; }
  .cms-sidebar-brand { font-size: 15px; font-weight: 700; color: #fff; white-space: nowrap; }
  .cms-sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .cms-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    background: none;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
  }
  .cms-nav-item:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
  .cms-nav-item-active { background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15)); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2); }
  .cms-nav-icon { flex-shrink: 0; }
  .cms-nav-label { font-size: 14px; font-weight: 500; flex: 1; }
  .cms-nav-arrow { margin-left: auto; opacity: 0.5; }
  .cms-sidebar-collapse {
    padding: 14px 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 13px;
    cursor: pointer;
    background: none;
    border-left: none;
    border-right: none;
    border-bottom: none;
    transition: color 0.2s;
  }
  .cms-sidebar-collapse:hover { color: #94a3b8; }

  /* TOPBAR */
  .cms-topbar {
    height: 64px;
    background: rgba(22,22,40,0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .cms-topbar-title { font-size: 18px; font-weight: 700; color: #f1f5f9; }
  .cms-topbar-right { display: flex; align-items: center; gap: 16px; }
  .cms-user-chip { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 40px; padding: 6px 14px 6px 6px; }
  .cms-user-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #fff; }
  .cms-user-info { display: flex; flex-direction: column; }
  .cms-user-email { font-size: 12px; font-weight: 600; color: #e2e8f0; }
  .cms-user-role { font-size: 10px; color: #a78bfa; font-weight: 500; }
  .cms-logout-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; color: #f87171; font-size: 13px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
  .cms-logout-btn:hover { background: rgba(239,68,68,0.2); }

  /* MAIN */
  .cms-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .cms-content { flex: 1; padding: 28px; overflow-y: auto; }

  /* SECTION */
  .cms-section { max-width: 1200px; margin: 0 auto; }
  .cms-section-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
  .cms-section-title { font-size: 22px; font-weight: 800; color: #f1f5f9; margin: 0 0 4px 0; }
  .cms-section-subtitle { font-size: 13px; color: #64748b; margin: 0; }
  .cms-header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  /* BUTTONS */
  .cms-btn-primary { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 10px; color: white; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(99,102,241,0.3); }
  .cms-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
  .cms-btn-primary:disabled { opacity: 0.6; cursor: wait; }
  .cms-btn-secondary { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; color: #cbd5e1; font-size: 13px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
  .cms-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
  .cms-btn-icon { width: 32px; height: 32px; border-radius: 7px; border: 1px solid transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .cms-btn-edit { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.2); color: #818cf8; }
  .cms-btn-edit:hover { background: rgba(99,102,241,0.2); }
  .cms-btn-delete { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #f87171; }
  .cms-btn-delete:hover { background: rgba(239,68,68,0.2); }

  /* TABLE */
  .cms-table-wrapper { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; }
  .cms-table { width: 100%; border-collapse: collapse; }
  .cms-table thead tr { background: rgba(255,255,255,0.05); }
  .cms-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .cms-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .cms-table tbody tr:last-child { border-bottom: none; }
  .cms-table tbody tr:hover { background: rgba(255,255,255,0.03); }
  .cms-table td { padding: 13px 16px; font-size: 13px; color: #cbd5e1; vertical-align: middle; }
  .cms-td-primary { color: #f1f5f9; font-weight: 600; }
  .cms-td-actions { display: flex; gap: 6px; justify-content: flex-end; }
  .cms-langs { display: flex; gap: 4px; }
  .cms-muted { color: #64748b; }
  .cms-empty { text-align: center; color: #475569; font-style: italic; padding: 40px 16px !important; }
  .cms-link { display: inline-flex; align-items: center; gap: 4px; color: #818cf8; font-size: 12px; text-decoration: none; }
  .cms-link:hover { text-decoration: underline; }

  /* BADGE */
  .cms-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .cms-badge-blue { background: rgba(99,102,241,0.15); color: #818cf8; }
  .cms-badge-green { background: rgba(34,197,94,0.15); color: #4ade80; }
  .cms-badge-orange { background: rgba(245,158,11,0.15); color: #fbbf24; }
  .cms-badge-purple { background: rgba(168,85,247,0.15); color: #c084fc; }
  .cms-badge-red { background: rgba(239,68,68,0.15); color: #f87171; }

  /* SEARCH */
  .cms-search-box { position: relative; display: flex; align-items: center; }
  .cms-search-icon { position: absolute; left: 10px; color: #475569; pointer-events: none; }
  .cms-search-input { padding: 8px 12px 8px 32px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; color: #e2e8f0; font-size: 13px; outline: none; transition: border-color 0.2s; min-width: 200px; }
  .cms-search-input:focus { border-color: rgba(99,102,241,0.5); }
  .cms-search-input::placeholder { color: #475569; }

  /* MODAL */
  .cms-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .cms-modal { background: #1e1e35; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.5); }
  .cms-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .cms-modal-header h3 { font-size: 16px; font-weight: 700; color: #f1f5f9; margin: 0; }
  .cms-modal-close { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; color: #94a3b8; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
  .cms-modal-close:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
  .cms-modal-body { padding: 24px; }
  .cms-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }

  /* FORM */
  .cms-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .cms-span-2 { grid-column: span 2; }
  .cms-form-group { display: flex; flex-direction: column; gap: 6px; }
  .cms-form-group label { font-size: 12px; font-weight: 600; color: #94a3b8; }
  .cms-select { padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e2e8f0; font-size: 13px; outline: none; width: 100%; }
  .cms-select option { background: #1e1e35; }

  /* CODE */
  .cms-code { background: rgba(99,102,241,0.1); color: #818cf8; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; }

  /* LOADING */
  .cms-loading { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 60px; color: #475569; }
  .cms-spin { animation: cms-spin-anim 1s linear infinite; }
  @keyframes cms-spin-anim { to { transform: rotate(360deg); } }

  /* STATS */
  .cms-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .cms-stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 16px; transition: transform 0.2s; }
  .cms-stat-card:hover { transform: translateY(-2px); }
  .cms-stat-blue { border-color: rgba(99,102,241,0.25); }
  .cms-stat-green { border-color: rgba(34,197,94,0.25); }
  .cms-stat-purple { border-color: rgba(168,85,247,0.25); }
  .cms-stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .cms-stat-blue .cms-stat-icon { background: rgba(99,102,241,0.15); color: #818cf8; }
  .cms-stat-green .cms-stat-icon { background: rgba(34,197,94,0.15); color: #4ade80; }
  .cms-stat-purple .cms-stat-icon { background: rgba(168,85,247,0.15); color: #c084fc; }
  .cms-stat-info { display: flex; flex-direction: column; }
  .cms-stat-value { font-size: 32px; font-weight: 800; color: #f1f5f9; line-height: 1; }
  .cms-stat-label { font-size: 13px; color: #64748b; margin-top: 4px; }

  /* WELCOME BANNER */
  .cms-welcome-banner { background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1)); border: 1px solid rgba(99,102,241,0.2); border-radius: 14px; padding: 24px; display: flex; gap: 16px; align-items: flex-start; }
  .cms-welcome-icon { width: 52px; height: 52px; background: rgba(99,102,241,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #818cf8; flex-shrink: 0; }
  .cms-welcome-title { font-size: 16px; font-weight: 700; color: #f1f5f9; margin: 0 0 8px 0; }
  .cms-welcome-text { font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6; }

  /* DIRECTIONS GRID */
  .cms-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .cms-dir-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px; transition: all 0.2s; }
  .cms-dir-card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-1px); }
  .cms-dir-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .cms-dir-icon { color: #818cf8; }
  .cms-dir-name { font-size: 14px; font-weight: 700; color: #f1f5f9; }
  .cms-dir-info { font-size: 12px; color: #64748b; margin-bottom: 6px; }
  .cms-dir-label { color: #475569; font-weight: 600; margin-right: 6px; }
  .cms-dir-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }

  /* TEXTS EDITOR */
  .cms-texts-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
  .cms-locale-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 4px; }
  .cms-locale-tab { padding: 8px 18px; border-radius: 7px; border: none; background: none; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .cms-locale-tab-active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; box-shadow: 0 2px 8px rgba(99,102,241,0.3); }
  .cms-texts-editor { display: flex; flex-direction: column; gap: 16px; }
  .cms-text-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
  .cms-text-section-title { padding: 14px 18px; font-size: 13px; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .cms-text-fields { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .cms-text-field { display: grid; grid-template-columns: 180px 1fr; gap: 10px; align-items: start; }
  .cms-text-label { padding-top: 8px; }
  .cms-field-key { font-size: 11px; background: rgba(255,255,255,0.05); color: #94a3b8; padding: 3px 7px; border-radius: 5px; font-family: monospace; }
  .cms-text-input { width: 100%; padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e2e8f0; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; box-sizing: border-box; }
  .cms-text-input:focus { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05); }
  .cms-text-textarea { resize: vertical; min-height: 64px; }
  .cms-text-preview { font-size: 11px; color: #475569; grid-column: 2; font-style: italic; white-space: pre-wrap; }
  .cms-texts-save-bar { display: flex; align-items: center; gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; }
  .cms-save-hint { font-size: 12px; color: #475569; }

  /* INPUT overrides for dark theme */
  input, textarea, select {
    background: rgba(255,255,255,0.05) !important;
    border-color: rgba(255,255,255,0.12) !important;
    color: #e2e8f0 !important;
  }
  input:focus, textarea:focus, select:focus {
    border-color: rgba(99,102,241,0.5) !important;
    outline: none !important;
  }
  input::placeholder, textarea::placeholder { color: #475569 !important; }

  @media (max-width: 768px) {
    .cms-stats-grid { grid-template-columns: 1fr; }
    .cms-form-grid { grid-template-columns: 1fr; }
    .cms-span-2 { grid-column: span 1; }
    .cms-text-field { grid-template-columns: 1fr; }
    .cms-text-preview { grid-column: 1; }
    .cms-sidebar { display: none; }
  }
`;
