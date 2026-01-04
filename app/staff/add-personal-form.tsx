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

//Form Schema
const formSchema = z.object({
  personal_name: z
    .string()
    .min(2, "Personal name debe tener minimo 2 characters.")
    .max(100, "Personal name debe tener 100 caracteres.")
    .nonempty("Nombre del personal obligatorio."),
  address: z.string().nonempty("Dirección es obligatoria."),
  phone: z.string().nonempty("Telefono es obligatorio."),
  email: z.email("Email no es valido").optional(),
  province: z.string().min(1, "Seleccione al menos una provincia."),
  municipalitiy: z.string().min(1, "Seleccione al menos un municipio."),
  hire_status_id: z.string(),
  personal_id: z.string(),
  specialty: z.string(),
  cv: z.file(),
});

//Funcino para debuguear el formulario
export function BugReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
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
  });
}

function NewPersonal() {
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
