"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { findCidadeByNome, searchCidades } from "@/services/cidades-service";
import type { Cidade } from "@/types/cidade";
import type { ClienteInput } from "@/types/cliente";

interface ClienteFormProps {
  mode: "create" | "edit";
  initialValues?: ClienteInput;
  onSubmit: (input: ClienteInput) => Promise<void>;
  submitLabel: string;
}

interface FormErrors {
  nome?: string;
  telefone?: string;
  documento?: string;
  endereco?: string;
  cidade?: string;
}

const emptyValues: ClienteInput = {
  nome: "",
  email: "",
  telefone: "",
  documento: "",
  dataNascimento: null,
  endereco: "",
  cidade: "",
};

export function ClienteForm({ mode, initialValues, onSubmit, submitLabel }: ClienteFormProps) {
  const { notify } = useToast();
  const [values, setValues] = useState<ClienteInput>(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [cidadeOptions, setCidadeOptions] = useState<Cidade[]>([]);
  const [showEnderecoConfirm, setShowEnderecoConfirm] = useState(false);
  const [enderecoConfirmado, setEnderecoConfirmado] = useState(false);

  function updateField<K extends keyof ClienteInput>(field: K, value: ClienteInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCidadeChange(value: string) {
    updateField("cidade", value);
    setCidadeOptions(value.trim() ? await searchCidades(value) : []);
  }

  function handleEnderecoBlur() {
    if (
      mode === "edit" &&
      initialValues &&
      values.endereco !== initialValues.endereco &&
      !enderecoConfirmado
    ) {
      setEnderecoConfirmado(true);
      setShowEnderecoConfirm(true);
    }
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!values.nome.trim()) nextErrors.nome = "Informe o nome.";
    if (!values.telefone.trim()) nextErrors.telefone = "Informe o telefone.";
    if (!values.documento.trim()) nextErrors.documento = "Informe o documento (CPF/CNPJ).";
    if (!values.endereco.trim()) nextErrors.endereco = "Informe o endereço.";
    if (!values.cidade.trim()) nextErrors.cidade = "Informe a cidade.";
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const cidadeEncontrada = await findCidadeByNome(values.cidade);
    if (!cidadeEncontrada) {
      setErrors({ cidade: "Cidade não encontrada. Selecione uma cidade cadastrada." });
      notify("error", "Cidade não encontrada. Selecione uma cidade cadastrada antes de continuar.");
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await onSubmit(values);
      notify(
        "success",
        mode === "create" ? "Cliente cadastrado com sucesso." : "Cliente atualizado com sucesso."
      );
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível salvar o cliente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            value={values.nome}
            onChange={(event) => updateField("nome", event.target.value)}
            error={errors.nome}
          />
          <Input
            label="E-mail"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          <Input
            label="Telefone"
            value={values.telefone}
            onChange={(event) => updateField("telefone", event.target.value)}
            error={errors.telefone}
          />
          <Input
            label="Documento (CPF/CNPJ)"
            value={values.documento}
            onChange={(event) => updateField("documento", event.target.value)}
            error={errors.documento}
          />
          <Input
            label="Data de Nascimento"
            type="date"
            value={values.dataNascimento ?? ""}
            onChange={(event) => updateField("dataNascimento", event.target.value || null)}
          />
          <Input
            label="Endereço"
            value={values.endereco}
            onChange={(event) => updateField("endereco", event.target.value)}
            onBlur={handleEnderecoBlur}
            error={errors.endereco}
          />
          <Combobox
            label="Cidade"
            value={values.cidade}
            onChange={handleCidadeChange}
            onSelect={(option) => {
              updateField("cidade", option.nome);
              setCidadeOptions([]);
            }}
            options={cidadeOptions}
            placeholder="Buscar cidade cadastrada..."
            error={errors.cidade}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" href="/clientes">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {submitLabel}
          </Button>
        </div>
      </form>

      <Modal
        isOpen={showEnderecoConfirm}
        onClose={() => setShowEnderecoConfirm(false)}
        title="Endereço alterado"
        footer={<Button onClick={() => setShowEnderecoConfirm(false)}>Entendi</Button>}
      >
        <p className="text-sm text-foreground/70">
          O endereço foi alterado. Verifique se a cidade também precisa ser atualizada antes de salvar.
        </p>
      </Modal>
    </>
  );
}
