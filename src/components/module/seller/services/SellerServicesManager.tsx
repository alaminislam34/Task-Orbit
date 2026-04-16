"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useCreateExtension,
  useCreateService,
  useDeactivateExtension,
  useSellerServices,
  useServiceExtensions,
  useUpdateExtension,
  useUpdateService,
} from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  CreateServicePayload,
  Service,
  ServicePackage,
  UpdateServicePayload,
} from "@/types/services.types";
import type { CreateExtensionPayload, Extension } from "@/types/extensions.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/PageHeader";

type ServiceForm = {
  title: string;
  description: string;
  category: string;
  basePrice: string;
  currency: string;
  deliveryDays: string;
  revisions: string;
  features: string;
  tags: string;
  imageUrls: string;
  packageName: string;
  packagePrice: string;
};

type ExtensionForm = {
  name: string;
  description: string;
  price: string;
  currency: string;
};

const PAGE_SIZE = 8;

const emptyServiceForm: ServiceForm = {
  title: "",
  description: "",
  category: "web-development",
  basePrice: "",
  currency: "USD",
  deliveryDays: "3",
  revisions: "1",
  features: "",
  tags: "",
  imageUrls: "",
  packageName: "Starter",
  packagePrice: "",
};

const emptyExtensionForm: ExtensionForm = {
  name: "",
  description: "",
  price: "",
  currency: "USD",
};

const toNum = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeServiceForm = (service?: Service | null): ServiceForm => {
  if (!service) {
    return emptyServiceForm;
  }

  const basicPackage = service.packages?.[0];

  return {
    title: service.title || "",
    description: service.description || "",
    category: service.category || "web-development",
    basePrice: String(service.basePrice || ""),
    currency: service.currency || "USD",
    deliveryDays: String(service.deliveryDays || 3),
    revisions: String(service.revisions || 1),
    features: (service.features || []).join(", "),
    tags: (service.tags || []).join(", "),
    imageUrls: (service.imageUrls || []).join(", "),
    packageName: basicPackage?.name || "Starter",
    packagePrice: String(basicPackage?.price || service.basePrice || ""),
  };
};

export function SellerServicesManager() {
  const [search, setSearch] = useState("");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [extensionForm, setExtensionForm] = useState<ExtensionForm>(emptyExtensionForm);
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null);

  const sellerServicesQuery = useSellerServices();
  const services = sellerServicesQuery.data?.data ?? [];

  const displayedServices = useMemo(() => {
    if (!search.trim()) {
      return services.slice(0, PAGE_SIZE);
    }

    const key = search.trim().toLowerCase();
    return services
      .filter(
        (service) =>
          service.title.toLowerCase().includes(key) ||
          service.description.toLowerCase().includes(key),
      )
      .slice(0, PAGE_SIZE);
  }, [search, services]);

  useEffect(() => {
    if (!isServiceDialogOpen) {
      setEditingService(null);
      setServiceForm(emptyServiceForm);
      return;
    }

    setServiceForm(normalizeServiceForm(editingService));
  }, [editingService, isServiceDialogOpen]);

  useEffect(() => {
    if (!selectedServiceId && services.length) {
      setSelectedServiceId(services[0].id);
    }
  }, [selectedServiceId, services]);

  useEffect(() => {
    if (editingExtension) {
      setExtensionForm({
        name: editingExtension.name,
        description: editingExtension.description || "",
        price: String(editingExtension.price || ""),
        currency: editingExtension.currency || "USD",
      });
      return;
    }

    setExtensionForm(emptyExtensionForm);
  }, [editingExtension]);

  const createService = useCreateService();
  const updateService = useUpdateService(editingService?.id || "");

  const extensionsQuery = useServiceExtensions(selectedServiceId);
  const createExtension = useCreateExtension();
  const deactivateExtension = useDeactivateExtension();
  const updateExtension = useUpdateExtension(editingExtension?.id || "");

  const handleServiceSubmit = async () => {
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      toast.error("Service title and description are required.");
      return;
    }

    const defaultPackage: ServicePackage = {
      tier: "BASIC",
      name: serviceForm.packageName.trim() || "Starter",
      price: toNum(serviceForm.packagePrice || serviceForm.basePrice, 0),
      currency: serviceForm.currency || "USD",
    };

    const commonPayload: CreateServicePayload = {
      title: serviceForm.title.trim(),
      description: serviceForm.description.trim(),
      category: serviceForm.category.trim(),
      basePrice: toNum(serviceForm.basePrice, 0),
      currency: serviceForm.currency || "USD",
      deliveryDays: Math.max(1, toNum(serviceForm.deliveryDays, 1)),
      revisions: Math.max(0, toNum(serviceForm.revisions, 1)),
      features: toList(serviceForm.features),
      tags: toList(serviceForm.tags),
      imageUrls: toList(serviceForm.imageUrls),
      packages: [defaultPackage],
    };

    try {
      if (editingService) {
        const updatePayload: UpdateServicePayload = commonPayload;
        await updateService.mutateAsync(updatePayload);
        toast.success("Service updated successfully.");
      } else {
        await createService.mutateAsync(commonPayload);
        toast.success("Service created successfully.");
      }

      setIsServiceDialogOpen(false);
      await sellerServicesQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleExtensionSubmit = async () => {
    if (!selectedServiceId) {
      toast.error("Select a service to manage extensions.");
      return;
    }

    if (!extensionForm.name.trim()) {
      toast.error("Extension name is required.");
      return;
    }

    try {
      if (editingExtension) {
        await updateExtension.mutateAsync({
          name: extensionForm.name.trim(),
          description: extensionForm.description.trim(),
          price: toNum(extensionForm.price, 0),
          currency: extensionForm.currency,
        });
        toast.success("Extension updated.");
      } else {
        const payload: CreateExtensionPayload = {
          serviceId: selectedServiceId,
          name: extensionForm.name.trim(),
          description: extensionForm.description.trim(),
          price: toNum(extensionForm.price, 0),
          currency: extensionForm.currency,
        };

        await createExtension.mutateAsync(payload);
        toast.success("Extension created.");
      }

      setEditingExtension(null);
      setExtensionForm(emptyExtensionForm);
      await extensionsQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Manage Services"
        description="Create and maintain your gigs, packages, and service extensions."
        actions={(
          <Button onClick={() => setIsServiceDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            New Service
          </Button>
        )}
      />

      <div className="rounded-lg border bg-background p-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search service by title or description"
        />
      </div>

      {sellerServicesQuery.isLoading ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading services...</div>
      ) : displayedServices.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">No service found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {displayedServices.map((service) => (
            <div key={service.id} className="rounded-lg border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{service.title}</h2>
                  <p className="text-xs text-muted-foreground">{service.category}</p>
                </div>
                <Badge variant="secondary">{service.currency} {service.basePrice}</Badge>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingService(service);
                    setIsServiceDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={selectedServiceId === service.id ? "default" : "outline"}
                  onClick={() => setSelectedServiceId(service.id)}
                >
                  Manage Extensions
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border bg-background p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Service Extensions</h2>
          <span className="text-xs text-muted-foreground">
            {selectedServiceId ? `Service ID: ${selectedServiceId}` : "No service selected"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input
            value={extensionForm.name}
            onChange={(event) => setExtensionForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Extension name"
          />
          <Input
            value={extensionForm.price}
            onChange={(event) => setExtensionForm((prev) => ({ ...prev, price: event.target.value }))}
            type="number"
            placeholder="Price"
          />
          <Input
            value={extensionForm.currency}
            onChange={(event) => setExtensionForm((prev) => ({ ...prev, currency: event.target.value }))}
            placeholder="Currency"
          />
          <Button onClick={() => void handleExtensionSubmit()}>
            {editingExtension ? "Update" : "Add"} Extension
          </Button>
        </div>
        <Textarea
          value={extensionForm.description}
          onChange={(event) => setExtensionForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Extension description"
          className="mt-3"
        />

        <div className="mt-4 space-y-2">
          {extensionsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading extensions...</p>
          ) : (extensionsQuery.data?.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No extensions for selected service.</p>
          ) : (
            (extensionsQuery.data?.data ?? []).map((extension) => (
              <div key={extension.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                <div>
                  <p className="font-medium">{extension.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {extension.currency} {extension.price} • {extension.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingExtension(extension)}>
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void deactivateExtension.mutateAsync(extension.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Deactivate
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Create Service"}</DialogTitle>
            <DialogDescription>
              Keep your service setup clear with one default package and clean metadata.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                value={serviceForm.title}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Service title"
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                value={serviceForm.description}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Service description"
                className="min-h-28"
              />
            </div>
            <Input
              value={serviceForm.category}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Category slug"
            />
            <Input
              value={serviceForm.currency}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, currency: event.target.value }))}
              placeholder="Currency"
            />
            <Input
              type="number"
              value={serviceForm.basePrice}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, basePrice: event.target.value }))}
              placeholder="Base price"
            />
            <Input
              type="number"
              value={serviceForm.deliveryDays}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, deliveryDays: event.target.value }))}
              placeholder="Delivery days"
            />
            <Input
              type="number"
              value={serviceForm.revisions}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, revisions: event.target.value }))}
              placeholder="Revisions"
            />
            <Input
              value={serviceForm.packageName}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, packageName: event.target.value }))}
              placeholder="Default package name"
            />
            <Input
              type="number"
              value={serviceForm.packagePrice}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, packagePrice: event.target.value }))}
              placeholder="Default package price"
            />
            <Input
              value={serviceForm.features}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, features: event.target.value }))}
              placeholder="Features (comma separated)"
            />
            <Input
              value={serviceForm.tags}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, tags: event.target.value }))}
              placeholder="Tags (comma separated)"
            />
            <div className="md:col-span-2">
              <Input
                value={serviceForm.imageUrls}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, imageUrls: event.target.value }))}
                placeholder="Image URLs (comma separated)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleServiceSubmit()} disabled={createService.isPending || updateService.isPending}>
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SellerServicesManager;
