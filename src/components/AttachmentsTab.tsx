import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import {
  FileText,
  Image as ImageIcon,
  FileWarning,
  Upload,
  Download,
  Trash2,
  X,
  Stethoscope,
  ClipboardList,
  Pill,
  FileCheck2,
  FilePlus2,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Anexo {
  id: number;
  titulo: string;
  nome_arquivo: string;
  tipo: string;
  tipo_mime: string;
  tamanho_bytes: number | string;
  data_criacao: string;
}

interface AttachmentsTabProps {
  pacienteId: string;
}

const TIPOS = [
  { value: 'exame', label: 'Exame', icon: Stethoscope, color: 'bg-sky-500/12 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300' },
  { value: 'laudo', label: 'Laudo', icon: ClipboardList, color: 'bg-violet-500/12 text-violet-700 dark:bg-violet-400/12 dark:text-violet-300' },
  { value: 'receita', label: 'Receita', icon: Pill, color: 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300' },
  { value: 'atestado', label: 'Atestado', icon: FileCheck2, color: 'bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300' },
  { value: 'outro', label: 'Outro', icon: FileText, color: 'chip-neutral' },
];

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(mime: string) {
  if (!mime) return FileText;
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime === 'application/pdf') return FileText;
  return FileWarning;
}

export function AttachmentsTab({ pacienteId }: AttachmentsTabProps) {
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'exame',
    file: null as File | null,
  });

  async function loadAnexos() {
    try {
      setLoading(true);
      const response = await api.get(`/pacientes/${pacienteId}/anexos`);
      setAnexos(response.data);
    } catch (err) {
      console.error('Erro ao carregar anexos', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnexos();
  }, [pacienteId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const nomeSemExt = file.name.replace(/\.[^/.]+$/, '');
    setFormData((prev) => ({
      ...prev,
      file,
      titulo: prev.titulo || nomeSemExt,
    }));
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.file) {
      toast.error('Selecione um arquivo antes de enviar.');
      return;
    }
    if (formData.file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande (máx. 10MB).');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('documento', formData.file);
      fd.append('titulo', formData.titulo);
      fd.append('tipo', formData.tipo);

      await api.post(`/pacientes/${pacienteId}/anexos`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Anexo adicionado com sucesso!');
      setUploadModalOpen(false);
      setFormData({ titulo: '', tipo: 'exame', file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      loadAnexos();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao enviar anexo.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number, titulo: string) {
    if (!confirm(`Tem certeza que deseja remover "${titulo}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await api.delete(`/anexos/${id}`);
      toast.success('Anexo removido.');
      loadAnexos();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao remover anexo.');
    }
  }

  function openAnexo(anexo: Anexo) {
    const token = localStorage.getItem('@VitareFisio:token');
    fetch(`${api.defaults.baseURL}/anexos/${anexo.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch(() => toast.error('Não foi possível abrir o anexo.'));
  }

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[220px] items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Carregando anexos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Documentos</p>
          <h3 className="font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50">Exames e anexos</h3>
        </div>
        <button onClick={() => setUploadModalOpen(true)} className="primary-button">
          <Upload className="h-4 w-4" />
          Adicionar anexo
        </button>
      </div>

      {anexos.length === 0 ? (
        <div className="surface-panel flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
          <FilePlus2 className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-800 dark:text-slate-100">Nenhum anexo enviado para este paciente.</p>
          <button onClick={() => setUploadModalOpen(true)} className="ghost-button mt-4 text-sky-600 dark:text-sky-300">
            Adicionar primeiro documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {anexos.map((anexo) => {
            const tipoCfg = TIPOS.find((tipo) => tipo.value === anexo.tipo) || TIPOS[TIPOS.length - 1];
            const TipoIcon = tipoCfg.icon;
            const FileIcon = getFileIcon(anexo.tipo_mime);

            return (
              <div key={anexo.id} className="surface-panel group flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                  <FileIcon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900 dark:text-slate-100">{anexo.titulo}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-bold ${tipoCfg.color}`}>
                      <TipoIcon className="h-3.5 w-3.5" />
                      {tipoCfg.label}
                    </span>
                    <span>{formatBytes(Number(anexo.tamanho_bytes))}</span>
                    <span>{format(new Date(anexo.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <button onClick={() => openAnexo(anexo)} className="icon-button h-10 w-10" title="Abrir ou baixar">
                    <Download className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(anexo.id, anexo.titulo)} className="icon-button h-10 w-10" title="Remover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {uploadModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card max-w-xl">
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Adicionar anexo</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Envie exames, receitas, laudos ou documentos complementares.</p>
                </div>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="icon-button h-10 w-10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5 p-6">
              <div>
                <label className="form-label">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                  className="input-shell"
                  placeholder="Ex: Ressonância lombar"
                  required
                />
              </div>

              <div>
                <label className="form-label">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
                  className="select-shell"
                >
                  {TIPOS.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Arquivo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="input-shell file:mr-3 file:rounded-xl file:border-0 file:bg-sky-500/10 file:px-3 file:py-2 file:font-semibold file:text-sky-700 dark:file:bg-sky-400/12 dark:file:text-sky-300"
                  accept=".pdf,image/*"
                />
                <p className="helper-text">Tamanho máximo de 10MB. Aceita PDF e imagens.</p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="secondary-button flex-1">
                  Cancelar
                </button>
                <button type="submit" disabled={uploading} className="primary-button flex-1">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Enviar anexo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
