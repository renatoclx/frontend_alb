"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { findCidadeByNome, searchCidades } from "@/services/cidades-service";
import type { Cidade } from "@/types/cidade";
import type { ClienteInput } from "@/types/cliente";
import { maskDocumento, maskTelefone, onlyDigits } from "@/utils/mask";

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
  const [values, setValues] = useState<ClienteInput>(() => {
    const base = initialValues ?? emptyValues;
    return {
      ...base,
      telefone: maskTelefone(base.telefone),
      documento: maskDocumento(base.documento),
    };
  });
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
      await onSubmit({
        ...values,
        telefone: onlyDigits(values.telefone),
        documento: onlyDigits(values.documento),
      });
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
      {/* Painel ocupa toda a largura disponível; o conteúdo fica centralizado
          numa faixa de leitura confortável (teste de layout). */}
      <Card className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate className="flex min-h-full flex-col">
          <CardContent className="mx-auto flex max-w-2xl flex-1 flex-col gap-8">
            <FormSection title="Dados pessoais">
              <div className="sm:col-span-2">
                <Input
                  label="Nome"
                  size="xl"
                  required
                  value={values.nome}
                  onChange={(event) => updateField("nome", event.target.value)}
                  error={errors.nome}
                />
              </div>
              <Input
                label="Documento (CPF/CNPJ)"
                size="xl"
                required
                value={values.documento}
                onChange={(event) => updateField("documento", maskDocumento(event.target.value))}
                error={errors.documento}
              />
              <Input
                label="Data de Nascimento"
                size="xl"
                type="date"
                value={values.dataNascimento ?? ""}
                onChange={(event) => updateField("dataNascimento", event.target.value || null)}
                disabled={mode === "edit"}
                title={mode === "edit" ? "Não pode ser alterada após o cadastro." : undefined}
              />
            </FormSection>

            <FormSection title="Contato">
              <Input
                label="Telefone"
                size="xl"
                required
                value={values.telefone}
                onChange={(event) => updateField("telefone", maskTelefone(event.target.value))}
                error={errors.telefone}
              />
              <Input
                label="E-mail"
                size="xl"
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </FormSection>

            <FormSection title="Endereço">
              <div className="sm:col-span-2">
                <Input
                  label="Endereço"
                  size="xl"
                  required
                  value={values.endereco}
                  onChange={(event) => updateField("endereco", event.target.value)}
                  onBlur={handleEnderecoBlur}
                  error={errors.endereco}
                />
              </div>
              <div className="sm:col-span-2">
                <Combobox
                  label="Cidade"
                  size="xl"
                  required
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
            </FormSection>
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="button" size="xl" variant="secondary" href="/clientes">
              Cancelar
            </Button>
            <Button type="submit" size="xl" isLoading={isSaving}>
              {submitLabel}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Modal
        isOpen={showEnderecoConfirm}
        onClose={() => setShowEnderecoConfirm(false)}
        title="Endereço alterado"
        size="sm"
        footer={<Button onClick={() => setShowEnderecoConfirm(false)}>Entendi</Button>}
      >
        <p className="text-sm text-foreground/70">
          O endereço foi alterado. Verifique se a cidade também precisa ser atualizada antes de salvar.
        </p>
      </Modal>
    </>
  );
}
