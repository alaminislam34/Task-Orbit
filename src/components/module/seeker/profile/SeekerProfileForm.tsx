"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import {
  useJobSeekerProfile,
  useUpdateJobSeekerProfile,
  useUpdateUserMe,
  useUser,
} from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const splitCommaValues = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function SeekerProfileForm() {
  const { data: userData, isLoading: isUserLoading } = useUser();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useJobSeekerProfile();
  const updateUserMe = useUpdateUserMe();
  const updateProfile = useUpdateJobSeekerProfile();

  const user = userData?.data;
  const profile = profileData?.data;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setImage(user?.image || "");
  }, [user?.name, user?.image]);

  useEffect(() => {
    setDesignation(profile?.designation || "");
    setBio(profile?.bio || "");
    setLocation(profile?.location || "");
    setSkills((profile?.skills || []).join(", "));
    setExperience((profile?.experience || []).join(", "));
    setEducation((profile?.education || []).join(", "));
    setResumeUrl(profile?.resumeUrl || "");
    setPortfolioUrl(profile?.portfolioUrl || "");
    setLinkedInUrl(profile?.linkedInUrl || "");
  }, [profile]);

  const isLoading = isUserLoading || isProfileLoading;
  const isSubmitting = updateUserMe.isPending || updateProfile.isPending;

  const validationError = useMemo(() => {
    if (name.trim().length === 0) {
      return "Name is required.";
    }

    if (bio.length > 1200) {
      return "Bio is too long. Keep it within 1200 characters.";
    }

    return null;
  }, [name, bio]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await updateUserMe.mutateAsync({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      await updateProfile.mutateAsync({
        designation: designation.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        skills: splitCommaValues(skills),
        experience: splitCommaValues(experience),
        education: splitCommaValues(education),
        resumeUrl: resumeUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        linkedInUrl: linkedInUrl.trim() || undefined,
      });

      toast.success("Profile updated successfully.");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          Keep account info and your job seeker profile up to date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">
            Loading profile...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-border/70 p-4">
              <h3 className="mb-3 text-sm font-medium text-foreground">Account Basics</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 p-4">
              <h3 className="text-sm font-medium text-foreground">Professional Snapshot</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="Dhaka, Bangladesh"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  disabled={isSubmitting}
                  className="min-h-32"
                  placeholder="Write your summary..."
                />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 p-4">
              <h3 className="text-sm font-medium text-foreground">Experience and Skills</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(event) => setSkills(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (comma separated)</Label>
                  <Input
                    id="experience"
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="3 years frontend, 1 year full stack"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education (comma separated)</Label>
                <Input
                  id="education"
                  value={education}
                  onChange={(event) => setEducation(event.target.value)}
                  disabled={isSubmitting}
                  placeholder="BSc in CSE, MSc in Software Engineering"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/70 p-4">
              <h3 className="mb-3 text-sm font-medium text-foreground">Links and Resume</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="resume-url">Resume URL</Label>
                  <Input
                    id="resume-url"
                    value={resumeUrl}
                    onChange={(event) => setResumeUrl(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-url">Portfolio URL</Label>
                  <Input
                    id="portfolio-url"
                    value={portfolioUrl}
                    onChange={(event) => setPortfolioUrl(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                  <Input
                    id="linkedin-url"
                    value={linkedInUrl}
                    onChange={(event) => setLinkedInUrl(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t pt-2">
              <Button type="submit" disabled={Boolean(validationError) || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
