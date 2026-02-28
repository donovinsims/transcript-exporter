"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { rememberCredentials, setRememberCredentials, clearCredentials, recentJobs } = useStore();
    const { toast } = useToast();

    const handleClear = () => {
        clearCredentials();
        toast({
            title: "Data Cleared",
            description: "Local credentials and temp states have been removed.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your app preferences and stored credentials.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Configure how the app behaves in your browser.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Remember Sessions</Label>
                            <p className="text-sm text-muted-foreground">
                                Saves your batch job history in the browser. Credentials are never sent to external servers.
                            </p>
                        </div>
                        <Switch
                            checked={rememberCredentials}
                            onCheckedChange={setRememberCredentials}
                        />
                    </div>

                    <div className="border-t pt-6 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-destructive">Clear All Data</Label>
                            <p className="text-sm text-muted-foreground">
                                Removes all stored credentials and job histories.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleClear} className="min-h-[44px]">
                            Erase Data
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>Recent jobs processed</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentJobs && recentJobs.length > 0 ? (
                        <div className="text-sm">
                            You have {recentJobs.length} recent jobs in history.
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            No recent jobs.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
