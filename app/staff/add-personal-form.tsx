"use client";
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
import { IconPlus } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
//Importando el formulario hook react

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useState } from "react";

//Form Schema
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

//Herramienta para manejar los datos del formulario
type FormValues = z.infer<typeof formSchema>;

function NewPersonal() {
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
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [municipalitiys, setMunicipalitiys] = useState<
    { id: string; name: string }[]
  >([]);
  const [hireStatuses, setHireStatuses] = useState<
    { id: string; label: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // cargar los datos dinamicos
  React.useEffect(() => {
    (async () => {
      try {
        //Trayendo los datos desde la api
        const [provincesRes, hireStatusRes] = await Promise.all([
          fetch("/api/provinces"),
          fetch("/api/hire-statuses"),
        ]);
        //Guardando los datos en el estado en formato json
        const [provincesData, hireStatusData] = await Promise.all([
          provincesRes.json(),
          hireStatusRes.json(),
        ]);
        setProvinces(provincesData);
        setHireStatuses(hireStatusData);
      } catch (error) {
        toast.error(
          "No se pudieron cargar las provincias o estados de contratación."
        );
      }
    })();
  }, []);

  //Cargar municipios cuando cambie la provincia
  const provinceValue = form.watch("province");
  React.useEffect(() => {
    form.setValue("municipalitiy", ""); //Resetear municipio al cambiar de provincia
    if (!provinceValue) {
      setMunicipalitiys([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/municipalities?province=${provinceValue}`
        );
        const data = await res.json();
        setMunicipalitiys(data);
      } catch (error) {
        toast.error("No se pudieron cargar los municipios.");
      }
    })();
  }, [provinceValue]);

  //Configurando el submit del formulario

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <IconPlus className="mr-2" />
            <span className="hidden lg:inline">Nuevo Personal</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // lógica de submit
            }}
          >
            <DialogHeader>
              <DialogTitle>Nuevo Personal</DialogTitle>
              <DialogDescription>
                Asegurece de ingresar los datos correctamente.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue="@peduarte"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewPersonal;
