"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Zod form schema (cliente) ---
const formSchema = z.object({
  personal_name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100"),
  address: z.string().min(1, "Dirección obligatoria"),
  phone: z.string().min(1, "Teléfono obligatorio"),
  email: z
    .email("Email no válido")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  province: z.string().min(1, "Seleccione provincia"),
  municipalitiy: z.string().min(1, "Seleccione municipio"),
  hire_status_id: z.string().min(1, "Seleccione estado"),
  personal_id: z.string().optional(),
  specialty: z.string().min(1, "Especialidad obligatoria"),
  cv: z
    .custom<File>((v) => v instanceof File, { message: "Adjunte CV" })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPersonal() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal_name: "",
      address: "",
      phone: "",
      email: "",
      province: "",
      municipalitiy: "",
      hire_status_id: "",
      personal_id: "",
      specialty: "",
      cv: undefined,
    },
    mode: "onChange",
  });

  //Hooks para datos dinamicos
  const [provinces, setProvinces] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [municipalities, setMunicipalities] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [hireStatuses, setHireStatuses] = React.useState<
    { id: string; label: string }[]
  >([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Cargar provincias y estados al abrir el diálogo (o al montar)
  React.useEffect(() => {
    (async () => {
      try {
        const [pRes, hRes] = await Promise.all([
          fetch("/api/provinces"),
          fetch("/api/hire-statuses"),
        ]);
        const [pData, hData] = await Promise.all([pRes.json(), hRes.json()]);
        setProvinces(pData);
        setHireStatuses(hData);
      } catch (e) {
        toast.error("No se pudieron cargar provincias/estados");
      }
    })();
  }, []);

  // Cargar municipios cuando cambie provincia
  const provinceValue = form.watch("province");
  React.useEffect(() => {
    form.setValue("municipalitiy", ""); // reset municipio al cambiar provincia
    if (!provinceValue) {
      setMunicipalities([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/municipalities?province=${provinceValue}`
        );
        const data = await res.json();
        setMunicipalities(data);
      } catch (e) {
        toast.error("No se pudieron cargar municipios");
      }
    })();
  }, [provinceValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      const fd = new FormData();
      fd.append("personal_name", values.personal_name);
      fd.append("address", values.address);
      fd.append("phone", values.phone);
      if (values.email) fd.append("email", values.email);
      fd.append("province", values.province);
      fd.append("municipalitiy", values.municipalitiy);
      fd.append("hire_status_id", values.hire_status_id);
      fd.append("personal_id", values.personal_id || "");
      fd.append("specialty", values.specialty);
      if (values.cv instanceof File) fd.append("cv", values.cv);

      const res = await fetch("/api/personal", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        toast.error("Error al guardar. Revise los campos.");
        return;
      }
      const data = await res.json();
      toast.success("Personal creado correctamente");
      setDialogOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado al guardar");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <IconPlus className="h-4 w-4" />
          <span className="hidden lg:inline">Nuevo Personal</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Nuevo Personal</DialogTitle>
            <DialogDescription>
              Asegúrese de ingresar los datos correctamente.
            </DialogDescription>
          </DialogHeader>

          {/* Grid 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre y apellidos</Label>
              <Input
                placeholder="Ej. Pedro Duarte"
                {...form.register("personal_name")}
              />
              {form.formState.errors.personal_name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.personal_name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Carné de identidad</Label>
              <Input
                placeholder="Ej. 90010112345"
                {...form.register("personal_id")}
              />
              {form.formState.errors.personal_id && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.personal_id.message}
                </p>
              )}
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input
                inputMode="tel"
                placeholder="+53 5 123 4567"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email (opcional)</Label>
              <Input
                type="email"
                placeholder="nombre@empresa.cu"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Input
                placeholder="Calle, número, entrecalles"
                {...form.register("address")}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Provincia</Label>
              <Select
                value={form.getValues("province")}
                onValueChange={(val) =>
                  form.setValue("province", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.province && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.province.message}
                </p>
              )}
            </div>

            <div>
              <Label>Municipio</Label>
              <Select
                value={form.getValues("municipalitiy")}
                onValueChange={(val) =>
                  form.setValue("municipalitiy", val, { shouldValidate: true })
                }
                disabled={!form.getValues("province")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      form.getValues("province")
                        ? "Seleccione el municipio"
                        : "Seleccione primero la provincia"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {municipalities.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.municipalitiy && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.municipalitiy.message}
                </p>
              )}
            </div>
          </div>

          {/* Contratación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Especialidad</Label>
              <Input
                placeholder="Ej. Conductor"
                {...form.register("specialty")}
              />
              {form.formState.errors.specialty && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.specialty.message}
                </p>
              )}
            </div>

            <div>
              <Label>Estado de contratación</Label>
              <Select
                value={form.getValues("hire_status_id")}
                onValueChange={(val) =>
                  form.setValue("hire_status_id", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  {hireStatuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.hire_status_id && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.hire_status_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label>Currículum (PDF/DOCX)</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                const file = e.target.files?.[0];
                form.setValue("cv", file as any, { shouldValidate: true });
              }}
            />
            {form.formState.errors.cv && (
              <p className="text-sm text-destructive">
                {form.formState.errors.cv.message as string}
              </p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!form.formState.isValid}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
