"use client";

import { FormEvent, useEffect, useState } from "react";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { listCategorias } from "@/services/categorias-service";
import type { Categoria } from "@/types/categoria";
import type { ProdutoInput, ProdutoTipo } from "@/types/produto";
import { maskMoney, parseMoney } from "@/utils/mask";

interface ProdutoFormProps {
  mode: "create" | "edit";
  initialValues?: ProdutoInput;
  onSubmit: (input: ProdutoInput) => Promise<void>;
  submitLabel: string;
}

interface FormErrors {
  nome?: string;
  categoriaId?: string;
  precoCompra?: string;
  precoVenda?: string;
  precoLocacao?: string;
  quantidade?: string;
  quantidadeMinima?: string;
}

const emptyValues: ProdutoInput = {
  nome: "",
  referencia: "",
  descricao: "",
  tipo: "venda",
  precoCompra: 0,
  precoVenda: null,
  precoLocacao: null,
  quantidade: 0,
  quantidadeMinima: 0,
  categoriaId: "",
};

const tipoOptions: { value: ProdutoTipo; label: string }[] = [
  { value: "venda", label: "Venda" },
  { value: "locacao", label: "Locação" },
];

// Máscara monetária reaproveita `maskMoney`, que trata dígitos como
// centavos — daí converter o número salvo de volta pra centavos aqui.
function moneyToDisplay(value: number | null): string {
  if (!value) return "";
  return maskMoney(String(Math.round(value * 100)));
}

export function ProdutoForm({
  mode,
  initialValues,
  onSubmit,
  submitLabel,
}: ProdutoFormProps) {
  const { notify } = useToast();
  const [values, setValues] = useState<ProdutoInput>(
    initialValues ?? emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    listCategorias().then(setCategorias);
  }, []);

  function updateField<K extends keyof ProdutoInput>(
    field: K,
    value: ProdutoInput[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!values.nome.trim()) nextErrors.nome = "Informe o nome do produto.";
    if (!values.categoriaId)
      nextErrors.categoriaId = "Selecione uma categoria.";

    if (values.precoCompra <= 0)
      nextErrors.precoCompra = "Informe o preço de compra.";

    if (values.tipo === "venda") {
      if (!values.precoVenda || values.precoVenda <= 0) {
        nextErrors.precoVenda = "Informe o preço de venda.";
      } else if (values.precoVenda < values.precoCompra) {
        nextErrors.precoVenda =
          "O preço de venda não pode ser menor que o preço de compra.";
      }
    } else if (!values.precoLocacao || values.precoLocacao <= 0) {
      nextErrors.precoLocacao = "Informe o preço de locação.";
    }

    if (values.quantidade <= 0)
      nextErrors.quantidade = "Informe uma quantidade maior que zero.";
    if (values.quantidadeMinima <= 0) {
      nextErrors.quantidadeMinima =
        "Informe uma quantidade mínima maior que zero.";
    } else if (values.quantidade < values.quantidadeMinima) {
      nextErrors.quantidade =
        "A quantidade não pode ser menor que a quantidade mínima.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(values);
      notify(
        "success",
        mode === "create"
          ? "Produto cadastrado com sucesso."
          : "Produto atualizado com sucesso.",
      );
    } catch (error) {
      notify(
        "error",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex min-h-full flex-col"
      >
        <CardContent className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 sm:flex-row sm:items-start">
          {/* Divisão de colunas definida em docs/screens.md (Produto > Cadastro
              > Padrão de formulário): coluna 1 = Tipo de Produto + Preços,
              coluna 2 = restante do cadastro. */}
          <div className="flex flex-1 flex-col gap-6">
            <ButtonGroup
              label="Tipo de produto"
              required
              options={tipoOptions}
              value={values.tipo}
              onChange={(tipo) => updateField("tipo", tipo)}
            />

            <FormSection title="Preços">
              <Input
                label="Preço de Compra"
                size="xl"
                required
                value={moneyToDisplay(values.precoCompra)}
                onChange={(event) =>
                  updateField("precoCompra", parseMoney(event.target.value))
                }
                startAdornment={<CircleDollarSign className="size-4" />}
                error={errors.precoCompra}
              />
              {values.tipo === "venda" ? (
                <Input
                  label="Preço de Venda"
                  size="xl"
                  required
                  value={moneyToDisplay(values.precoVenda)}
                  onChange={(event) =>
                    updateField("precoVenda", parseMoney(event.target.value))
                  }
                  startAdornment={<CircleDollarSign className="size-4" />}
                  error={errors.precoVenda}
                />
              ) : (
                <Input
                  label="Preço de Locação"
                  size="xl"
                  required
                  value={moneyToDisplay(values.precoLocacao)}
                  onChange={(event) =>
                    updateField("precoLocacao", parseMoney(event.target.value))
                  }
                  startAdornment={<CircleDollarSign className="size-4" />}
                  error={errors.precoLocacao}
                />
              )}
            </FormSection>
          </div>

          <div className="flex flex-1 flex-col gap-8">
            <FormSection title="Identificação">
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
                label="Referência"
                size="xl"
                value={values.referencia}
                onChange={(event) =>
                  updateField("referencia", event.target.value)
                }
              />
              <Select
                label="Categoria"
                size="xl"
                required
                value={values.categoriaId}
                onChange={(value) => updateField("categoriaId", value)}
                options={categorias.map((categoria) => ({
                  value: categoria.id,
                  label: categoria.nome,
                }))}
                placeholder="Selecione uma categoria"
                error={errors.categoriaId}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Descrição"
                  size="xl"
                  value={values.descricao}
                  onChange={(event) =>
                    updateField("descricao", event.target.value)
                  }
                />
              </div>
            </FormSection>

            <FormSection title="Estoque">
              <Input
                label="Quantidade"
                size="xl"
                type="number"
                required
                value={values.quantidade || ""}
                onChange={(event) =>
                  updateField("quantidade", Number(event.target.value))
                }
                error={errors.quantidade}
              />
              <Input
                label="Quantidade Mínima"
                size="xl"
                type="number"
                required
                value={values.quantidadeMinima || ""}
                onChange={(event) =>
                  updateField("quantidadeMinima", Number(event.target.value))
                }
                error={errors.quantidadeMinima}
              />
            </FormSection>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="button" size="xl" variant="secondary" href="/produtos">
            Cancelar
          </Button>
          <Button type="submit" size="xl" isLoading={isSaving}>
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
