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
  Loader2
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
  { value: 'exame', label: 'Exame', icon: Stethoscope, color: 'text-blue-600 bg-blue-50' },
  { value: 'laudo', label: 'Laudo', icon: ClipboardList, color: 'text-violet-600 bg-violet-50' },
  { value: 'receita', label: 'Receita', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },
  { value: 'atestado', label: 'Atestado', icon: FileCheck2, color: 'text-amber-600 bg-amber-50' },
  { value: 'outro', label: 'Outro', icon: FileText, color: 'text-slate-600 bg-slate-100' },
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
    // Sugere o título com o nome do ficheiro (sem extensão)
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
      toast.error('Selecione um ficheiro antes de enviar.');
      return;
    }
    if (formData.file.size > 10 * 1024 * 1024) {
      toast.error('Ficheiro muito grande (máx. 10MB).');
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
    // Abre em nova aba usando o token de autenticação via header (via fetch + blob)
    const token = localStorage.getItem('@VitareFisio:token');
    fetch(`${api.defaults.baseURL}/anexos/${anexo.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch(() => toast.error('Não foi possível abrir o anexo.'));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-slate-400 animate-pulse font-medium">
        Carregando anexos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <FilePlus2 className="w-5 h-5 text-blue-600" />
          Exames & Documentos
        </h3>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm text-sm"
        >
          <Upload className="w-4 h-4" />
          Adicionar Anexo
        </button>
      </div>

      {/* LISTA DE ANEXOS */}
      {anexos.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <FilePlus2 className="w-12 h-12 text-slate-200" />
          <p className="font-medium text-sm">Nenhum anexo enviado para este paciente.</p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="text-blue-600 font-bold text-sm hover:underline"
          >
            Adicionar primeiro documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {anexos.map((anexo) => {
            const tipoCfg = TIPOS.find((t) => t.value === anexo.tipo) || TIPOS[TIPOS.length - 1];
            const TipoIcon = tipoCfg.icon;
            const FileIcon = getFileIcon(anexo.tipo_mime);

            return (
              <div
                key={anexo.id}
                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
              >
                {/* Ícone do tipo de ficheiro */}
                <div className="p-3 rounded-xl bg-slate-50 shrink-0">
                  <FileIcon className="w-6 h-6 text-slate-500" />
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-800 text-sm truncate">{anexo.titulo}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded ${tipoCfg.color}`}>
                      <TipoIcon className="w-3 h-3" />
                      {tipoCfg.label}
                    </span>
                    <span>•</span>
                    <span>{formatBytes(Number(anexo.tamanho_bytes))}</span>
                    <span>•</span>
                    <span>{format(new Date(anexo.data_criacao), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                </div>

                {/* Acções */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openAnexo(anexo)}
                    className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                    title="Abrir / Baixar"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(anexo.id, anexo.titulo)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE UPLOAD */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" /> Adicionar Anexo
              </h2>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* DROPZONE */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  formData.file ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                  onChange={handleFileChange}
                />
                {formData.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck2 className="w-8 h-8 text-blue-600" />
                    <p className="font-bold text-slate-700 text-sm truncate max-w-full">{formData.file.name}</p>
                    <p className="text-[11px] text-slate-400">{formatBytes(formData.file.size)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload className="w-8 h-8" />
                    <p className="font-medium text-sm">Clique para escolher um ficheiro</p>
                    <p className="text-[11px]">PDF, imagens ou documentos até 10MB</p>
                  </div>
                )}
              </div>

              {/* TÍTULO */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Título</label>
                <input
                  required
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Raio-X da coluna lombar"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CATEGORIA */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Categoria</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {TIPOS.map((t) => {
                    const Icon = t.icon;
                    const active = formData.tipo === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, tipo: t.value })}
                        className={`p-2 rounded-lg border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !formData.file}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Anexo'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
