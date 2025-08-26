"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Upload,
  Save,
  Play,
  Settings,
  Folder,
  Code,
  FileSpreadsheet,
  FileImage,
  Search,
  Menu,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface FileTab {
  id: string
  name: string
  type: "code" | "pdf" | "excel" | "image" | "text"
  content: string
  language?: string
}

export function ViewFilesCodeEditor() {
  const [openFiles, setOpenFiles] = useState<FileTab[]>([
    {
      id: "1",
      name: "welcome.js",
      type: "code",
      language: "javascript",
      content: `// Bem-vindo ao ViewFilesCode!
// Editor moderno para todos os tipos de arquivo

function welcome() {
  console.log("Olá, desenvolvedor! 👋");
  console.log("Arraste seus arquivos aqui para começar");
}

welcome();`,
    },
  ])
  const [activeFileId, setActiveFileId] = useState("1")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeFile = openFiles.find((f) => f.id === activeFileId)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const fileType = getFileType(file.name)

        const newFile: FileTab = {
          id: Date.now().toString() + index,
          name: file.name,
          type: fileType,
          content: content,
          language: getLanguageFromExtension(file.name),
        }

        setOpenFiles((prev) => [...prev, newFile])
        setActiveFileId(newFile.id)
      }
      reader.readAsText(file)
    })
  }

  const getFileType = (filename: string): FileTab["type"] => {
    const ext = filename.split(".").pop()?.toLowerCase()
    if (
      ["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "html", "css", "php", "rb", "go", "rs"].includes(ext || "")
    )
      return "code"
    if (ext === "pdf") return "pdf"
    if (["xlsx", "xls", "csv"].includes(ext || "")) return "excel"
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext || "")) return "image"
    return "text"
  }

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const langMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
    }
    return langMap[ext || ""] || "text"
  }

  const closeFile = (fileId: string) => {
    const newFiles = openFiles.filter((f) => f.id !== fileId)
    setOpenFiles(newFiles)

    if (activeFileId === fileId && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id)
    }
  }

  const updateFileContent = (content: string) => {
    setOpenFiles((prev) => prev.map((f) => (f.id === activeFileId ? { ...f, content } : f)))
  }

  const getFileIcon = (type: FileTab["type"]) => {
    switch (type) {
      case "code":
        return <Code className="size-4" />
      case "pdf":
        return <FileText className="size-4" />
      case "excel":
        return <FileSpreadsheet className="size-4" />
      case "image":
        return <FileImage className="size-4" />
      default:
        return <FileText className="size-4" />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="size-4" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ViewFilesCode
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border">
              <Button onClick={() => fileInputRef.current?.click()} className="w-full gap-2">
                <Upload className="size-4" />
                Abrir Arquivos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.php,.rb,.go,.rs,.pdf,.xlsx,.xls,.csv,.txt,.md,.json,.xml,.yml,.yaml"
              />
            </div>

            <div className="flex-1 p-4">
              <h3 className="text-sm font-semibold text-sidebar-foreground mb-3 flex items-center gap-2">
                <Folder className="size-4" />
                Arquivos Abertos
              </h3>
              <div className="space-y-1">
                {openFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                      activeFileId === file.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50"
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    {getFileIcon(file.type)}
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeFile(file.id)
                      }}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* File Tabs */}
          {openFiles.length > 0 && (
            <div className="h-10 bg-card border-b border-border flex items-center overflow-x-auto">
              {openFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-2 px-4 h-full border-r border-border cursor-pointer transition-colors ${
                    activeFileId === file.id ? "bg-background text-foreground" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  {getFileIcon(file.type)}
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-4 ml-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeFile(file.id)
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 p-4">
            {activeFile ? (
              <Card className="h-full p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      {getFileIcon(activeFile.type)}
                      <span className="font-medium">{activeFile.name}</span>
                      {activeFile.language && <Badge variant="secondary">{activeFile.language}</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Minimize2 className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Maximize2 className="size-4" />
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Play className="size-4" />
                        Executar
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Save className="size-4" />
                        Salvar
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    {activeFile.type === "code" || activeFile.type === "text" ? (
                      <Textarea
                        value={activeFile.content}
                        onChange={(e) => updateFileContent(e.target.value)}
                        className="h-full font-mono text-sm resize-none border-0 bg-transparent focus-visible:ring-0"
                        placeholder="Digite seu código aqui..."
                      />
                    ) : activeFile.type === "pdf" ? (
                      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
                        <div className="text-center">
                          <FileText className="size-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium">Visualizador de PDF</p>
                          <p className="text-muted-foreground">Arquivo: {activeFile.name}</p>
                        </div>
                      </div>
                    ) : activeFile.type === "excel" ? (
                      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
                        <div className="text-center">
                          <FileSpreadsheet className="size-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium">Visualizador de Excel</p>
                          <p className="text-muted-foreground">Arquivo: {activeFile.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
                        <div className="text-center">
                          <FileImage className="size-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium">Visualizador de Imagem</p>
                          <p className="text-muted-foreground">Arquivo: {activeFile.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="size-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Code className="size-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Bem-vindo ao ViewFilesCode</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Editor moderno para arquivos de código, PDF, Excel e muito mais. Arraste seus arquivos aqui ou
                    clique em "Abrir Arquivos" para começar.
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()} size="lg" className="gap-2">
                    <Upload className="size-5" />
                    Abrir Arquivos
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-6 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Linha 1, Coluna 1</span>
          {activeFile && (
            <>
              <span>•</span>
              <span>{activeFile.language || "texto"}</span>
              <span>•</span>
              <span>{activeFile.content.length} caracteres</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>Powered by team</span>
          <a
            href="https://dodideiyu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            dodideiyu
          </a>
        </div>
      </footer>
    </div>
  )
}
